import { Response } from "express";
import { AuthRequest } from "../utils/definitions";
import checkUserAuth from "../utils/authorization/checkUserAuth";
import prisma from "../prisma";

import { User } from "@prisma/client";
import { capitalize } from "../utils/functions";
import { userUpdateValidation } from "../utils/validators/userValidation";
import jwt from "jsonwebtoken";
import updateEmailRequest from "../utils/email/updateEmailRequest";
import Joi from "joi";
import bcrypt from "bcrypt";

const userSelector: any = { address: true };

/**
 * Retrieves user information for the authenticated user.
 *
 * @param req - The request object containing the user's authorization token.
 * @param res - The response object to send the result.
 * @returns A JSON response with the success status and the retrieved user information.
 * The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: User,
 * }
 * where `User` is the shape of a user object returned by Prisma.
 */
export const getUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    // Check if this is a team member or regular user
    const account = await checkUserAuth(req, res);

    if (!account) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.accountType === "teamMember") {
      // For team members, return the team member info
      const teamMemberInfo = await prisma.teamMember.findUnique({
        where: { id: account.id },
      });

      return res.status(200).json({ success: true, results: teamMemberInfo });
    } else {
      // For regular users, include address and update last login
      const userInfo = await prisma.user.findUnique({
        where: { id: account.id },
        include: userSelector,
      });

      await prisma.user.update({
        where: { id: account.id },
        data: {
          lastLogin: new Date(),
        },
      });

      return res.status(200).json({ success: true, results: userInfo });
    }
  } catch (error) {
    const err = error as Error;
    console.error("Get User Info error", {
      message: err.message,
      stack: err.stack,
    });

    // Return a 500 error response if something went wrong
    return res.status(500).json({
      success: false,
      message: "Failed to get user info. Please try again later.",
    });
  }
};

/**
 * Updates user information.
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
export const updateUserInfo = async (req: AuthRequest, res: Response) => {
  // Define the allowed keys for user update
  const input = req.body;

  try {
    if (input?.phoneNumber[0] !== "+")
      input.phoneNumber = "+" + input.phoneNumber.toString();
    // Authorize the user
    const user = await checkUserAuth(req, res);

    // Find the user info
    const userInfo = await prisma.user.findUnique({
      where: { id: user?.id },
      include: userSelector,
    });

    // If there is no user info
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate the inputs
    const { error } = userUpdateValidation.validate(input, {
      abortEarly: false,
    });

    // Return a list of errors if validation fails
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
      where: { id: user?.id },
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

    // Return the updated user info
    return res.status(200).json({ success: true, results: updatedUserInfo });
  } catch (error) {
    const err = error as Error;
    console.error("Update User Info error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update user info. Please try again later.",
    });
  }
};

// delete user
export const deleteUserInfo = async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  try {
    // Authorize the user
    const user = await checkUserAuth(req, res);

    // Find the user info
    const userInfo = await prisma.user.findUnique({
      where: { id: user?.id },
    });

    // validate password
    if (!password) {
      return res
        .status(400)
        .json({ success: false, validationErrors: "Password is required" });
    }

    // confirm password
    if (user && user.hashedPassword) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user?.hashedPassword
      );
      if (isPasswordValid === undefined || !isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, validationErrors: "Incorrect Password" });
      }
    }

    // If there is no user info
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete the user
    const deletedUser = await prisma.$transaction(async (transaction) => {
      // If the user has an address delete it
      if (userInfo.addressId) {
        await transaction.userAddress.delete({
          where: { id: userInfo.addressId },
        });
      }

      // Delete the user
      return await transaction.user.delete({
        where: { id: user?.id },
      });
    });

    // Return the deleted user
    return res.status(200).json({ success: true, results: deletedUser });
  } catch (error) {
    const err = error as Error;
    console.error("Delete User Info error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to delete user info. Please try again later.",
    });
  }
};

export const updateUserEmail = async (req: AuthRequest, res: Response) => {
  const { newEmail } = req.body;
  try {
    // Authorize the user
    const user = await checkUserAuth(req, res);

    // Validate the inputs
    const schema = Joi.object({
      newEmail: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be an empty field",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
      }),
    });
    const { error } = schema.validate({ newEmail });
    if (error) {
      return res
        .status(400)
        .json({ success: false, validationError: error.message });
    }

    // check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail?.trim().toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, validationError: "Email already exists" });
    }

    // send email update request
    if (user) {
      sendEmailVerificationToken(user, newEmail);
    }

    return res.status(200).json({
      success: true,
      message: "Update email request sent successfully",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update User Info error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update user info. Please try again later.",
    });
  }
};

/**
 * Verifies the updated email for a user.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token and the verification token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A Promise that resolves when the request is handled.
 */
export const verifyUpdatedEmail = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { token } = req.params;

  try {
    const user = await checkUserAuth(req, res);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      return res
        .status(500)
        .json({ success: false, message: "Secret key not configured" });
    }

    const decoded: any = jwt.verify(token, secretKey);

    if (user.email !== decoded.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // check if newEmail already exitst
    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.newEmail?.trim().toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: decoded.newEmail,
        verified: true,
      },
      include: userSelector,
    });

    return res.status(200).json({ success: true, results: updatedUser });
  } catch (error) {
    const err = error as Error;
    console.error("Update User Info error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update user info. Please try again later.",
    });
  }
};

// email verification token
function sendEmailVerificationToken(user: User, newEmail: string) {
  // create a token to send the email verification
  const secretKey = process.env.SECRET_KEY;
  let token;
  if (secretKey) {
    token = jwt.sign({ email: user.email, newEmail }, secretKey, {
      expiresIn: "10m",
    });
  }

  // user fullname
  const fullName = user.firstName + " " + user.lastName;

  // send email with the token
  if (token) updateEmailRequest(user.email, newEmail, token, fullName);
}

// update password
export const updateUserPassword = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await checkUserAuth(req, res);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // validate new password
    const schema = Joi.object({
      newPassword: Joi.string()
        .empty()
        .pattern(new RegExp("(?=.*[a-z])")) // at least one lowercase letter
        .pattern(new RegExp("(?=.*[A-Z])")) // at least one uppercase letter
        .pattern(new RegExp("(?=.*[0-9])")) // at least one digit
        .pattern(new RegExp("(?=.*[!@#$%^&*])")) // at least one special character
        .min(8) // minimum length 8
        .max(30) // maximum length 30
        .required()
        .messages({
          "string.empty": "New Password cannot be empty",
          "string.pattern.base":
            "New Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "string.min": "New Password must be at least 8 characters long",
          "string.max": "New Password must be at most 30 characters long",
          "any.required": "New Password is required",
        }),
      confirmNewPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .custom(() => {})
        .messages({
          "any.only": "Password and Confirm Password must match",
          "string.empty": "Confirm Password cannot be empty",
          "any.required": "Confirm Password is required",
        }),
    });

    const { error } = schema.validate({
      newPassword,
      confirmNewPassword,
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

    // check if old password is correct
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        validationError: { currentPassword: "Current password is incorrect" },
      });
    }

    // check if new password matches confirm new password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        validationError: {
          newPassword: "Old password cannot be the same as new password",
        },
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedPassword,
      },
      include: userSelector,
    });

    // if all correct, return success
    return res.status(200).json({ success: true, results: updatedUser });
  } catch (error) {
    const err = error as Error;
    console.error("Update User Info error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update user password. Please try again later.",
    });
  }
};
