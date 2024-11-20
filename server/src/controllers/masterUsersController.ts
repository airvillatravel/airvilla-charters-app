import { Response } from "express";
import prisma from "../prisma";
import checkUserAuth from "../utils/authorization/checkUserAuth";
import { AuthRequest } from "../utils/definitions";
import getMasterAccess from "../utils/access-check/getMasterAccess";
import { getIO } from "../socket";
import { capitalize, getCreatedTimeRange } from "../utils/functions";
import { userUpdateByMasterValidation } from "../utils/validators/masterValidation";
import bcrypt from "bcrypt";
import Joi from "joi";
import generateUserRefId from "../utils/generateUserRefId";

// user selector
const userSelector: any = {
  address: true,
  myTickets: true,
  purchasedTickets: true,
  agents: true,
};

/**
 * Get all users except the master user.
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved users. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: User[],
 *   nextCursor: string | null,
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;
  const { accountStatus } = req.query;

  // Get user filter parameters from request body
  const { accountType, subscriptionStatus, startDate, endDate } = req.body as {
    accountType: string;
    subscriptionStatus: string;
    startDate: string;
    endDate: string;
  };

  try {
    // authorize the user
    const user = await getMasterAccess(req, res);

    // Validate the ticketStatus query parameter
    const accountStatusValues = [
      // "all",
      "accepted",
      "pending",
      "rejected",
      "suspended",
    ];
    if (
      accountStatus &&
      !accountStatusValues.includes(accountStatus as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid accountStatus query parameter",
      });
    }

    // Apply filters to the query
    // Convert ticketStatus to the appropriate type
    const accountTypeFiltered = accountType as "all" &
      "affiliate" &
      "agency" &
      "master";

    const accountStatusFiltered = accountStatus as "accepted" & //  "all" &
      "pending" &
      "rejected" &
      "suspended";

    // select options
    const options: any = [
      {
        id: {
          not: (user as { id: string }).id,
        },
      },
      // only get the verified users
      { verified: true },
      accountStatusFiltered
        ? {
            accountStatus: accountTypeFiltered,
          }
        : {},
      accountTypeFiltered
        ? {
            role: accountTypeFiltered,
          }
        : {},
      subscriptionStatus
        ? {
            subscriptionStatus: subscriptionStatus,
          }
        : {},
    ];

    // get all users except master user
    const [users, usersTotal] = await Promise.all([
      await prisma.user.findMany({
        // filter out the master user
        where: {
          AND: options,
        },
        // include the address, tickets, purchased tickets, and agents
        include: userSelector,
        // limit the number of users to the pageSize
        take: pageSize,
        // skip the number of users based on the cursor
        skip: cursor ? 1 : 0,
        // set the cursor to the id of the last user
        cursor: cursor ? { id: cursor } : undefined,
        // sort the users by id in ascending order
        orderBy: {
          id: "asc",
        },
      }),
      // get the total number of users
      prisma.user.count({
        where: {
          AND: options,
        },
      }),
      prisma.user.update({
        where: { id: (user as { id: string }).id },
        data: {
          lastLogin: new Date(),
        },
      }),
    ]);

    // Handle generating `refId` if required
    for (const user of users) {
      if (!user.refId) {
        const refId = await generateUserRefId();
        // Update user with the generated refId
        await prisma.user.update({
          where: { id: user.id },
          data: { refId },
        });
      }
    }

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
    const err = error as Error;
    console.error("Master user: Get all users error", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to get users. Please try again later.",
    });
  }
};

/**
 * Retrieves a single user by their ID. This endpoint is accessible only to master users.
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved user. The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: User,
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
export const getSingleUserById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  try {
    // Authorize the user and check their role
    const user = await getMasterAccess(req, res);

    // Get user by ID
    const singleUser = await prisma.user.findFirst({
      where: {
        id: userId,
        verified: true,
      },
      include: userSelector,
    });

    // Return 404 if user doesn't exist
    if (!singleUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    // Return user
    return res.status(200).json({ success: true, results: singleUser });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: Get single user error", {
      message: err.message,
      stack: err.stack,
    });

    // Return 500 error if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to get user info. Please try again later.",
    });
  }
};

/**
 * Update a single user by ID.
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved user. The response object will have the following structure:
 * {
 *   success: boolean,
 *   message: string,
 *   results: User,
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
export const userAccountRequest = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const input = req.body;
  try {
    // Authorize the user and check their role
    const user = await getMasterAccess(req, res);

    // Check if the user exists
    const userToBeUpdate = await prisma.user.findFirst({
      where: { id: userId, verified: true },
    });

    // Return 404 if user doesn't exist
    if (!userToBeUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        id: userToBeUpdate.id,
      },
      data: {
        // Update account status and role, if provided
        accountStatus: input?.accountStatus?.trim().toLowerCase() ?? undefined,
        role: input?.role ?? undefined,
      },
      // Include the user's address, tickets, purchased tickets, and agents
      include: userSelector,
    });

    // Emit the updated user status
    if (updatedUser.accountStatus && input?.accountStatus) {
      const io = getIO();
      io.to(userId).emit("userRequestResponse", {
        accountStatus: updatedUser.accountStatus,
      });
    }

    // Return the updated user
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      results: updatedUser,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: Update user info error", {
      message: err.message,
      stack: err.stack,
    });

    // Return 500 error if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to get update user's info. Please try again later.",
    });
  }
};

/**
 * Deletes a single user by their ID.
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status, message, and the deleted user.
 */
export const deleteSingleUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  try {
    // Authorize the user and check their role
    const user = await getMasterAccess(req, res);

    // Check if the user exists
    const userToBeDeleted = await prisma.user.findFirst({
      where: { id: userId, verified: true },
    });

    // Return 404 if user doesn't exist
    if (!userToBeDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    // Delete the user and its address
    const deletedUser = await prisma.$transaction(async (transaction) => {
      // If the user has an address delete it
      if (userToBeDeleted.addressId) {
        await transaction.userAddress.delete({
          where: { id: userToBeDeleted.addressId },
        });
      }

      // Delete the user
      const deleteUser = await transaction.user.delete({
        where: { id: userToBeDeleted.id },
        include: userSelector,
      });

      return deleteUser;
    });

    // Return the deleted user
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      results: deletedUser,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: delete user info error", {
      message: err.message,
      stack: err.stack,
    });

    // Return 500 error if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to delete user's info. Please try again later.",
    });
  }
};

// Search all users
/**
 * Searches all users except the master user by searching the email,
 * username, firstName, lastName, username, and agencyName.
 * @param req - The request object containing the user's authorization token
 * @param res - The response object to send the results
 * @param searchInput - The search input string
 * @param pageSize - The number of users to return per page
 * @param cursor - The last user id to continue searching from
 * @returns A JSON response with the success status and the retrieved users.
 * The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: {
 *     users: User[],
 *     totalUsers: number,
 *     nextCursor: string | null
 *   }
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
type AccountType = "all" | "affiliate" | "agency" | "master";

interface SearchInputType {
  accountType: AccountType;
  subscriptionStatus: string;
  registrationDateFilter: string;
  lastLoginFilter: string;
  searchQuery: string;
}

export const searchAllUsers = async (req: AuthRequest, res: Response) => {
  const searchInput = req.query.input;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;
  const accountStatus = req.query.accountStatus as string;

  console.log({ searchInput });

  try {
    // authorize the user
    const user = await getMasterAccess(req, res);

    // // Check if searchInput exists and is a string
    if (!searchInput || typeof searchInput !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search input is required and must be a string",
      });
    }

    const parsed = JSON.parse(searchInput) as SearchInputType;
    const searchQuery = parsed.searchQuery
      ? parsed.searchQuery.toLowerCase()
      : "";

    // Validate the ticketStatus query parameter
    const accountStatusValues = [
      "all",
      "accepted",
      "pending",
      "rejected",
      "suspended",
    ];
    if (
      accountStatus &&
      !accountStatusValues.includes(accountStatus as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid accountStatus query parameter",
      });
    }

    // Create date ranges based on registrationDateFilter
    const registrationDateRange = parsed.registrationDateFilter
      ? getCreatedTimeRange(parsed.registrationDateFilter) // Assuming this helper function works for date ranges
      : {};

    // Create date ranges based on lastLoginFilter
    const lastLoginDateRange = parsed.lastLoginFilter
      ? getCreatedTimeRange(parsed.lastLoginFilter)
      : {};

    const searchUsersOptions: any = {
      AND: [
        {
          id: {
            not: (user as { id: string }).id,
          },
        },
        // only get the verified users
        { verified: true },
      ],
      NOT: [
        { role: "master" }, // Exclude users with the role of "master"
      ],
    };

    // Handle accountType filters
    if (parsed.accountType !== "all") {
      searchUsersOptions.AND.push({ role: parsed.accountType });
    } else {
      searchUsersOptions.AND.push({ role: { in: ["agency", "affiliate"] } });
    }

    // Handle subscriptionStatus filters
    if (parsed.subscriptionStatus !== "all") {
      searchUsersOptions.AND.push({
        subscriptionStatus: parsed.subscriptionStatus,
      });
    }
    // Handle accountStatus filter only if it's not "all"
    if (accountStatus && accountStatus !== "all") {
      searchUsersOptions.AND.push({ accountStatus });
    }

    // Add registration date filters
    if (registrationDateRange) {
      searchUsersOptions.AND.push({ createdAt: registrationDateRange });
    }

    // Add last login date filters
    if (lastLoginDateRange) {
      searchUsersOptions.AND.push({ lastLogin: lastLoginDateRange });
    }

    // Create the OR conditions for search queries
    const searchConditions = [
      {
        email: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        firstName: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        username: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        agencyName: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ];

    // Combine AND and OR conditions
    searchUsersOptions.AND.push({
      OR: searchConditions,
    });

    // search according to email, username, firstName, lastName, username, agencyName
    const [users, totalUsers] = await Promise.all([
      await prisma.user.findMany({
        where: searchUsersOptions,
        include: userSelector,
        take: pageSize,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      }),
      await prisma.user.count({
        where: searchUsersOptions,
      }),
      await prisma.user.update({
        where: { id: (user as { id: string }).id },
        data: {
          lastLogin: new Date(),
        },
      }),
    ]);

    const usersToUpdate = users.filter((user) => !user.refId);
    const updatePromises = usersToUpdate.map(async (user) => {
      const refId = await generateUserRefId();
      return prisma.user.update({
        where: { id: user.id },
        data: { refId },
      });
    });

    await Promise.all(updatePromises);

    // get the last user id
    const nextCursor =
      users.length === pageSize ? users[users.length - 1].id : null;

    // return user
    return res.status(200).json({
      success: true,
      results: {
        users,
        totalUsers,
        nextCursor,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: search all users info error", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to get delete user's info. Please try again later.",
    });
  }
};

/**
 * Updates user information for a master user.
 *
 * @param req - The request object containing the user's authorization token and the updated user information.
 * @param res - The response object to send the result.
 * @returns A JSON response with the success status and the updated user information.
 * The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: User,
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
export const updateUserInfoForMaster = async (
  req: AuthRequest,
  res: Response
) => {
  // Destructure the request body and userId from the request parameters
  const input = req.body;
  const { userId } = req.params;

  try {
    // Check if the phone number starts with a '+' sign, and prepend it if not
    if (input?.phoneNumber[0] !== "+") {
      input.phoneNumber = "+" + input.phoneNumber.toString();
    }
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Find the user info
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      include: userSelector,
    });

    // If the user info is not found, return a 404 error
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate the inputs
    const { error } = userUpdateByMasterValidation.validate(input, {
      abortEarly: false,
    });

    // If there are validation errors, return them as a 400 error
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        acc[detail.path.join(".")] = detail.message;
        return acc;
      }, {} as Record<string, string>);

      return res
        .status(400)
        .json({ success: false, validationError: errorDetails });
    }

    // Update the user info
    const updatedUserInfo = await prisma.user.update({
      where: { id: userId },
      data: {
        // Update user fields
        firstName: capitalize(input.firstName),
        lastName: capitalize(input.lastName),
        username: input.username?.trim().toLowerCase(),
        agencyName: input.agencyName ? capitalize(input.agencyName) : null,
        email: input.email?.trim().toLowerCase(),
        phoneNumber: input.phoneNumber?.trim(),
        nationality: input.nationality?.trim().toLowerCase(),
        dateOfBirth: input.dateOfBirth?.trim(),
        gender: input.gender?.trim().toLowerCase(),
        logo: input.logo?.trim(),
        role: input.role?.trim().toLowerCase(),
        iataNo: input.iataNo?.trim(),
        commercialOperationNo: input.commercialOperationNo?.trim(),
        website: input.website?.toLowerCase().trim(),
        address: {
          update: {
            // Update address fields
            country: capitalize(input.address?.country),
            city: capitalize(input.address?.city),
            street: input.address?.street?.trim(),
          },
        },
      },
      include: userSelector,
    });

    const io = getIO();
    io.to(userId).emit("updateUserProfile");

    // Return the updated user info
    return res.status(200).json({ success: true, results: updatedUserInfo });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: Update user info error", {
      message: err.message,
      stack: err.stack,
    });

    // Return 500 error if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to get update user's info. Please try again later.",
    });
  }
};

/**
 * Updates the password for a user with the specified userId.
 *
 * @param req - The request object containing the password and confirmPassword in the request body,
 * and the userId in the request parameters.
 * @param res - The response object used to send the result of the update operation.
 * @returns A response object with the success status and the updated user information if the update is successful,
 * or an error message if the update fails.
 */
export const updateUserPasswordForMaster = async (
  req: AuthRequest,
  res: Response
) => {
  // Destructure the request body and userId from the request parameters
  const { password, confirmPassword } = req.body;
  const { userId } = req.params;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Find the user info
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      include: userSelector,
    });

    // If the user info is not found, return a 404 error
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate the new password
    const schema = Joi.object({
      password: Joi.string()
        .empty()
        .pattern(new RegExp("(?=.*[a-z])")) // at least one lowercase letter
        .pattern(new RegExp("(?=.*[A-Z])")) // at least one uppercase letter
        .pattern(new RegExp("(?=.*[0-9])")) // at least one digit
        .pattern(new RegExp("(?=.*[!@#$%^&*])")) // at least one special character
        .min(8) // minimum length 8
        .max(30) // maximum length 30
        .required()
        .messages({
          "string.empty": "Password cannot be empty",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "string.min": "Password must be at least 8 characters long",
          "string.max": "Password must be at most 30 characters long",
          "any.required": "Password is required",
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .custom(() => {})
        .messages({
          "any.only": "Password and Confirm Password must match",
          "string.empty": "Confirm Password cannot be empty",
          "any.required": "Confirm Password is required",
        }),
    });

    const { error } = schema.validate({
      password,
      confirmPassword,
    });
    if (error) {
      const validationErrors = error.details.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return res
        .status(400)
        .json({ success: false, validationError: validationErrors });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hashedPassword: hashedPassword,
      },
      include: userSelector,
    });

    // If all correct, return success
    return res.status(200).json({ success: true, results: updatedUser });
  } catch (error) {
    const err = error as Error;
    console.error("Master user: Update user password error", {
      message: err.message,
      stack: err.stack,
    });

    // Return 500 error if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to update user password. Please try again later.",
    });
  }
};
