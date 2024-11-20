import { Response } from "express";
import {
  PrismaClient,
  TeamMemberRole,
  Department,
  AccountStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendInvitationEmail } from "../utils/email/sendInvitation";
import {
  generateInvitationToken,
  getCreatedTimeRange,
} from "../utils/functions";
import { AuthRequest } from "../utils/definitions";
import { Role } from "@prisma/client";
import getMasterAccess from "../utils/access-check/getMasterAccess";
import generateUserRefId from "../utils/generateUserRefId";

const prisma = new PrismaClient();

interface CreateTeamMemberRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: TeamMemberRole;
  department: Department;
  teamId: string;
  invitedById: string;
}

interface DateRange {
  from?: string;
  to?: string;
}

export const getTeamId = async (req: AuthRequest, res: Response) => {
  try {
    // Get the first team (assuming one team for now)
    const team = await prisma.team.findFirst();

    if (!team) {
      // If no team exists, create one
      const newTeam = await prisma.team.create({
        data: {
          name: "Default Team",
        },
      });
      return res.json({ teamId: newTeam.id });
    }

    return res.json({ teamId: team.id });
  } catch (error) {
    console.error("Error getting team ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      department,
      teamId,
      invitedById,
    } = req.body as CreateTeamMemberRequest;

    // Look for a default admin user if no inviter is specified
    const defaultAdmin = await prisma.user.findFirst({
      where: {
        role: Role.master,
      },
    });

    if (!defaultAdmin) {
      return res.status(500).json({
        message: "No admin user found to process the invitation",
      });
    }

    const effectiveInviterId = defaultAdmin.id;

    if (!teamId) {
      return res.status(400).json({
        message: "Missing required fields: teamId and invitedById are required",
      });
    }

    // Check if user already exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { email },
    });

    if (existingMember) {
      return res.status(400).json({
        message: "Team member with this email already exists",
      });
    }

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(400).json({
        message: "Team not found",
      });
    }

    if (effectiveInviterId) {
      // Check if inviter exists and has permission
      const inviter = await prisma.user.findUnique({
        where: { id: effectiveInviterId },
      });

      if (!inviter) {
        return res.status(400).json({
          message: "Inviter not found",
        });
      }
    }

    // Create everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create team member
      const teamMember = await tx.teamMember.create({
        data: {
          firstName,
          lastName,
          username: `${firstName}_${lastName}`,
          email,
          password: hashedPassword,
          role,
          department,
          team: {
            connect: { id: teamId },
          },
        },
      });

      // Generate invitation token (still needed for record keeping)
      const newToken = await generateInvitationToken();

      // Create invitation with accepted status
      const invitation = await tx.invitation.create({
        data: {
          token: newToken,
          email,
          role,
          department,
          status: "accepted", // Set as accepted immediately
          acceptedAt: new Date(), // Set acceptance timestamp
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          teamMember: {
            connect: { id: teamMember.id },
          },
          team: {
            connect: { id: teamId },
          },
          invitedBy: {
            connect: { id: effectiveInviterId },
          },
        },
      });

      return { teamMember, invitation };
    });

    // Still send invitation email to notify team member of their account creation
    await sendInvitationEmail(email, result.invitation.token, req.body);

    res.status(201).json({
      message: "Team member added successfully",
      teamMember: result.teamMember,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Assume the ID is passed as a URL parameter
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      department,
      teamId,
    } = req.body as Partial<CreateTeamMemberRequest>; // Partial to allow optional updates

    if (!id) {
      return res.status(400).json({ message: "Team member ID is required" });
    }

    // Check if the team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // If teamId is provided, verify the team exists
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
    }

    // Optional: Hash the password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the team member
    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        firstName: firstName ?? existingMember.firstName,
        lastName: lastName ?? existingMember.lastName,
        username: username ?? existingMember.username,
        email: email ?? existingMember.email,
        password: hashedPassword ?? existingMember.password,
        role: role ?? existingMember.role,
        department: department ?? existingMember.department,
        team: teamId ? { connect: { id: teamId } } : undefined, // Update team if teamId is provided
      },
    });

    res.status(200).json({
      message: "Team member updated successfully",
      teamMember: updatedMember,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamMembers = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;

    // Get filter parameters from query
    const accountType = req.query.accountType as Role | undefined;
    const department = req.query.department as Department | undefined;
    const registrationDateRange = req.query.registrationDate
      ? (JSON.parse(req.query.registrationDate as string) as DateRange)
      : undefined;
    const lastLoginRange = req.query.lastLogin
      ? (JSON.parse(req.query.lastLogin as string) as DateRange)
      : undefined;

    // Build filter conditions
    const filters: any = {
      AND: [{ verified: true }],
    };

    // Add account type filter if valid status is provided
    if (accountType && Object.values(Role).includes(accountType)) {
      filters.AND.push({ role: accountType });
    }

    // Add department filter if valid department is provided
    if (department && Object.values(Department).includes(department)) {
      filters.AND.push({ department });
    }

    // Add registration date range filter
    if (registrationDateRange) {
      const dateFilter: any = {};
      if (registrationDateRange.from) {
        dateFilter.gte = new Date(registrationDateRange.from);
      }
      if (registrationDateRange.to) {
        dateFilter.lte = new Date(registrationDateRange.to);
      }
      if (Object.keys(dateFilter).length > 0) {
        filters.AND.push({ createdAt: dateFilter });
      }
    }

    // Add last login range filter
    if (lastLoginRange) {
      const loginFilter: any = {};
      if (lastLoginRange.from) {
        loginFilter.gte = new Date(lastLoginRange.from);
      }
      if (lastLoginRange.to) {
        loginFilter.lte = new Date(lastLoginRange.to);
      }
      if (Object.keys(loginFilter).length > 0) {
        filters.AND.push({ lastLogin: loginFilter });
      }
    }

    // get all users except master user with filters
    const [users, usersTotal] = await Promise.all([
      prisma.teamMember.findMany({
        where: filters,
        take: pageSize,
        // skip the number of users based on the cursor
        skip: cursor ? 1 : 0,
        // set the cursor to the id of the last user
        cursor: cursor ? { id: cursor } : undefined,
        // sort the users by id in ascending order
        orderBy: {
          id: "asc",
        },
        // Include all fields including lastLogin
        select: {
          id: true,
          refId: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          role: true,
          department: true,
          status: true,
          accountStatus: true,
          verified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          invitation: true,
          team: true,
        },
      }),
      // get the total number of users
      prisma.teamMember.count({
        where: filters,
      }),
    ]);

    // Handle generating `refId` if required
    const refIdUpdates = users
      .filter((user) => !user.refId)
      .map(async (user) => {
        const refId = await generateUserRefId();
        return prisma.teamMember.update({
          where: { id: user.id },
          data: { refId },
        });
      });

    await Promise.all(refIdUpdates);

    const nextCursor =
      users.length === pageSize ? users[users.length - 1].id : null;

    // return users
    return res.status(200).json({
      success: true,
      results: {
        users,
        usersTotal,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchTeamMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { input } = req.query;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;

    let searchData = {
      searchQuery: "",
      accountType: "all",
      department: "all",
      registrationDateFilter: "all time",
      lastLoginFilter: "all time",
    };

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Search input is required",
      });
    }

    // let searchData;
    if (input) {
      try {
        searchData = JSON.parse(input as string);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid search input format",
        });
      }
    }

    const {
      searchQuery,
      accountType,
      department,
      registrationDateFilter,
      lastLoginFilter,
    } = searchData;

    const registrationDateRange = registrationDateFilter
      ? getCreatedTimeRange(registrationDateFilter)
      : {};

    const lastLoginDateRange = lastLoginFilter
      ? getCreatedTimeRange(lastLoginFilter)
      : {};

    // Build the where clause
    const whereClause: any = {
      AND: [{ verified: true }],
    };

    // Add search query filter if provided
    if (searchQuery) {
      whereClause.AND.push({
        OR: [
          { firstName: { contains: searchQuery, mode: "insensitive" } },
          { lastName: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      });
    }

    // Add account status filter if specified (using AccountStatus enum)
    if (accountType && accountType !== "all") {
      whereClause.AND.push({ role: accountType as Role });
    } else {
      whereClause.AND.push({ role: { in: ["moderator", "accountant"] } });
    }

    // Add department filter if specified (using Department enum)
    if (department && department !== "all") {
      whereClause.AND.push({ department: department as Department });
    }

    // Add registration date range filter
    if (registrationDateRange) {
      whereClause.AND.push({ createdAt: registrationDateRange });
    }

    // Add last login date range filter
    if (lastLoginDateRange) {
      whereClause.AND.push({ lastLogin: lastLoginDateRange });
    }

    // Fetch team members
    const [users, usersTotal] = await Promise.all([
      prisma.teamMember.findMany({
        where: whereClause,
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          refId: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          role: true,
          department: true,
          status: true,
          accountStatus: true,
          verified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          invitation: true,
          team: true,
        },
      }),
      prisma.teamMember.count({
        where: whereClause,
      }),
    ]);

    // Handle generating `refId` if required
    const refIdUpdates = users
      .filter((user) => !user.refId)
      .map(async (user) => {
        const refId = await generateUserRefId();
        return prisma.teamMember.update({
          where: { id: user.id },
          data: { refId },
        });
      });

    await Promise.all(refIdUpdates);

    const nextCursor =
      users.length === pageSize ? users[users.length - 1].id : null;

    return res.status(200).json({
      success: true,
      results: {
        users,
        usersTotal,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error searching team members:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { requesterId } = req.body;

    // Check if member exists
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!member) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    // Check if requester has permission (must be team master)
    const requester = await prisma.teamMember.findFirst({
      where: {
        id: requesterId,
        teamId: member.teamId,
        role: "master",
      },
    });

    if (!requester) {
      return res.status(403).json({
        message: "Unauthorized: Only team masters can remove members",
      });
    }

    // Delete team member (cascading deletion will handle invitation)
    await prisma.teamMember.delete({
      where: { id },
    });

    res.json({ message: "Team member removed successfully" });
  } catch (error) {
    console.error("Error removing team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { email, teamId, invitedById } = req.body;

    if (!teamId || !invitedById) {
      return res.status(400).json({
        message: "Missing required fields: teamId and invitedById are required",
      });
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { email },
      include: {
        invitation: true,
        team: true,
      },
    });

    if (!teamMember || teamMember.status === "active") {
      return res.status(400).json({
        message: "Invalid invitation request",
      });
    }

    // Revoke existing invitations if any
    if (teamMember.invitation.length > 0) {
      await prisma.invitation.updateMany({
        where: {
          teamMemberId: teamMember.id,
          status: "pending",
        },
        data: {
          status: "revoked",
          revokedAt: new Date(),
        },
      });
    }

    const newToken = await generateInvitationToken();

    // Create new invitation with accepted status
    const invitation = await prisma.invitation.create({
      data: {
        token: newToken,
        email,
        role: teamMember.role,
        department: teamMember.department,
        status: "accepted", // Set as accepted immediately
        acceptedAt: new Date(), // Set acceptance timestamp
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        teamMember: {
          connect: { id: teamMember.id },
        },
        team: {
          connect: { id: teamId },
        },
        invitedBy: {
          connect: { id: invitedById },
        },
      },
    });

    // Still send invitation email to notify team member
    await sendInvitationEmail(email, invitation.token, "********"); // Password hidden in resend

    res.json({
      message: "Team member status updated and notification sent",
      invitation,
    });
  } catch (error) {
    console.error("Error updating team member status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
