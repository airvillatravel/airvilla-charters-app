import { Response } from "express";
import { PrismaClient, TeamMemberRole } from "@prisma/client";
import { generateInviteToken } from "../utils/authorization/tokens";
import { sendInvitationEmail } from "../utils/email/sendInvitation";
import { AuthRequest } from "../utils/definitions";
// import { getTeamId } from "./teamController";

const prisma = new PrismaClient();

export const getTeamId = async (req: AuthRequest, res: Response) => {
  try {
    // Get the first team (assuming one team for now)
    const team = await prisma.team.findFirst();
    
    if (!team) {
      // If no team exists, create one
      const newTeam = await prisma.team.create({
        data: {
          name: "Default Team"
        }
      });

      return newTeam.id; 
    }

    return team.id ;
  } catch (error) {
    console.error("Error getting team ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createInvitation =  async (req: AuthRequest, res: Response) => {
  try {
    const { email, role, department } = req.body;
    const inviterId = req.user?.id;

    if (!inviterId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get team ID first
    const teamId = (await getTeamId(req, res)) as string;

        // Get the team member record for the inviter
        const teamMember = await prisma.teamMember.findFirst({
          where: {
            id: inviterId,
            teamId: teamId
          }
        });
    
        if (!teamMember) {
          return res.status(404).json({ error: "Team member not found" });
        }

    // Create invitation with 7-day expiration
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        teamMember: {
          connect: { id: teamMember.id }
        },
        team: {
          connect: { id: teamId }
        },
        invitedBy: {
          connect: { id: inviterId }
        },
        status: "pending",
        acceptedAt: null,
        revokedAt: null,
        department,
        token: await generateInviteToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Send invitation email
    if (req.user) {
      console.log("req,user",req.user);
      await sendInvitationEmail(email, invitation.token, req.user);
    }

    res.json(invitation);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ error: errorMessage });
  }
};

// Update an invitation's status (e.g., from pending to another status)
export const updateInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { status },
    });

    res.json(updatedInvitation);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ error: errorMessage });
  }
};

// Revoke (delete) an invitation
export const revokeInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.invitation.delete({
      where: { id },
    });

    res.json({ message: "Invitation revoked successfully" });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ error: errorMessage });
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;

    // Find and validate invitation with related team member
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      // include: {
      //   teamMember: true,
      // },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already processed" });
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "expired" },
      });
      return res.status(400).json({ message: "Invitation has expired" });
    }

    // Start a transaction to ensure all updates succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update team member status to active
      await tx.teamMember.update({
        where: { id: invitation.teamMemberId as string },
        data: { status: "active" },
      });

      // Mark invitation as accepted and set acceptedAt timestamp
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          acceptedAt: new Date(),
        },
      });
    });

    res.json({
      message: "Invitation accepted successfully",
      // teamMember: invitation.teamMember,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // Helper function to send invitation
// export const sendInvitation = async (req: Request, res: Response) => {
//   try {
//     const { userId, teamId, teamMemberId } = req.body;

//     // Get the user that is sending the invitation
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { role: true },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the user is a master or moderator
//     if (user.role !== Role.master && user.role !== Role.moderator) {
//       return res.status(403).json({
//         message: "Only master or agency users can send invitations",
//       });
//     }

//     // Generate a unique token (UUID v4)
//     const token = crypto.randomUUID();

//     // Set expiration to 24 hours from now
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 24);

//     // Create the invitation
//     const invitation = await prisma.invitation.create({
//       data: {
//         token,
//         teamId,
//         teamMemberId,
//         invitedById: userId,
//         expiresAt,
//         status: "pending",
//       },
//       include: {
//         teamMember: true,
//         team: true,
//       },
//     });

//     res.json({
//       message: "Invitation sent successfully",
//       invitation,
//     });
//   } catch (error) {
//     console.error("Error sending invitation:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
