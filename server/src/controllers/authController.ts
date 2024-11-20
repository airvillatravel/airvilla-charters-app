import prisma from "../prisma";
import { Request, Response } from "express";
import {
  loginValidation,
  signupValidation,
} from "../utils/validators/authValidator";
import { capitalize, trimPhoneNumber } from "../utils/functions";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import sendEmail from "../utils/email/emailVerification";
import { AuthRequest } from "../utils/definitions";
import checkUserAuth from "../utils/authorization/checkUserAuth";
import { User } from "@prisma/client";
import sendResetPasswordEmail from "../utils/email/sendResetPasswordEmail";
import Joi from "joi";
import {
  clearSessionExpiration,
  trackSessionExpiration,
} from "../utils/schedule/trackSessionExpiration";
import generateUserRefId from "../utils/generateUserRefId";

/**
 * Signup endpoint for creating a new user.
 * @param req - The request object containing user data.
 * @param res - The response object to send the response.
 * @returns The response object with the result of the signup process.
 */
export const signup = async (req: Request, res: Response) => {
  // Extract the user data from the request body
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    phoneNumber,
    nationality,
    dateOfBirth,
    gender,
    country,
    city,
    street,
    role,
    agencyName,
    iataNo,
    commercialOperationNo,
    website,
  } = req.body;

  try {
    // Add a '+' before the phone number
    if (phoneNumber[0] !== "+")
      req.body.phoneNumber = "+" + phoneNumber.toString();

    // Validate the inputs
    const { error } = signupValidation.validate(req.body, {
      abortEarly: false,
    });

    // Return list of errors if validation fails
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        if (detail.context && detail.context.key) {
          acc[detail.context.key] = detail.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return res
        .status(400)
        .json({ success: false, validationErrors: errorDetails });
    }

    // Check if email already exists
    const emailExist = await prisma.user.findUnique({ where: { email } });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "email already exist",
        validationErrors: { email: "email already exist" },
      });
    }

    // Check if username already exists
    const usernameExist = await prisma.user.findUnique({ where: { username } });
    if (usernameExist) {
      return res.status(400).json({
        success: false,
        message: "username already exist",
        validationErrors: { username: "username already exist" },
      });
    }

    // Confirm password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password doesn't match confirm password",
        validationErrors: {
          confirmPassword: "Password doesn't match confirm password",
        },
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique refId (you can use any logic to generate this)
    const refId = await generateUserRefId();

    // Return an error if the reference ID is not available
    if (!refId) {
      return res.status(400).json({
        success: false,
        message: "Couldn't generate a reference ID",
      });
    }

    // Save user signup in the database
    const user = await prisma.user.create({
      data: {
        refId: refId,
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        username: username?.trim().toLowerCase(),
        email: email?.trim().toLowerCase(),
        hashedPassword,
        phoneNumber: trimPhoneNumber(phoneNumber),
        nationality: nationality?.trim().toLowerCase(),
        dateOfBirth: dateOfBirth?.trim(),
        gender: gender?.trim().toLowerCase(),
        role: role.trim().toLowerCase(),
        agencyName: agencyName ? capitalize(agencyName) : null,
        iataNo: iataNo?.trim(),
        commercialOperationNo: commercialOperationNo?.trim(),
        website: website?.toLowerCase().trim(),
        address: {
          create: {
            country: capitalize(country),
            city: capitalize(city),
            street: street?.trim(),
          },
        },
      },
    });

    // Send email verification token
    sendEmailValidationToken(user);

    // Create and save token in cookie
    createCookieToken(user, "user", res);

    // Send just some user info
    const userInfo = {
      refId: refId,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      agencyName: user.agencyName,
      role: user.role,
      accountStatus: user.accountStatus,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Return success
    return res.status(200).json({
      success: true,
      message: "signup successfully",
      results: userInfo,
    });
  } catch (error) {
    const err = error as Error;
    // Log the error and return a 500 response
    console.error("Signup error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to signup. Please try again later.",
    });
  }
};

/**
 * Handles the login request.
 * @param req - The request object containing the user's email and password.
 * @param res - The response object to send the response.
 * @returns The response object with the result of the login process.
 */
export const login = async (req: Request, res: Response) => {
  // Destructure the request body
  const { email, password } = req.body;

  try {
    // Validate the inputs
    const { error } = loginValidation.validate(req.body, {
      abortEarly: false,
    });

    // Return list of errors if validation fails
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        if (detail.context && detail.context.key) {
          acc[detail.context.key] = detail.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return res
        .status(400)
        .json({ success: false, validationErrors: errorDetails });
    }

    // Verify if the email exists
    const user = await prisma.user.findUnique({
      where: { email: email?.toLowerCase() },
    });

    const teamMember = await prisma.teamMember.findUnique({
      where: { email: email?.toLowerCase() },
    });

    // Return error if email is invalid
    const account = user || teamMember;
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
        validationErrors: { email: "Invalid email" },
      });
    }
    // Compare the password with the hashed password in the database
    const comparePassword = await bcrypt.compare(
      password,
      account === user ? user.hashedPassword : teamMember!.password
    );

    // Return error if password is invalid
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
        validationErrors: { password: "Invalid password" },
      });
    }

    // Update lastLogin for team member
    if (teamMember) {
      await prisma.teamMember.update({
        where: { id: teamMember.id },
        data: { lastLogin: new Date() },
      });
    }

    // Create and save token in cookie
    createCookieToken(account, account === user ? "user" : "teamMember", res);

    // Send just some user info
    const userInfo = user
      ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          agencyName: user.agencyName,
          role: user.role,
          logo: user.logo,
          accountStatus: user.accountStatus,
          verified: user.verified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : {
          id: teamMember!.id,
          firstName: teamMember!.firstName,
          lastName: teamMember!.lastName,
          email: teamMember!.email,
          role: teamMember!.role,
          department: teamMember!.department,
          status: teamMember!.status,
          teamId: teamMember!.teamId,
          lastLogin: teamMember!.lastLogin,
          createdAt: teamMember!.createdAt,
          updatedAt: teamMember!.updatedAt,
        };

    // Return success
    return res.status(200).json({
      success: true,
      message: "login successfully",
      results: userInfo,
    });
  } catch (error) {
    const err = error as Error;

    // Log the error and return a 500 response
    console.error("Login error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to login. Please try again later.",
    });
  }
};

/**
 * Logs out the user by clearing the token cookie.
 *
 * @param req - The request object containing the user's token.
 * @param res - The response object to send the result.
 * @returns A JSON response with the success status and a message.
 */
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // Remove the token and expiration from the database
    // const user = await prisma.user.update({
    //   where: { id: req.userId },
    //   data: {
    //     tokenExpiresAt: "",
    //   },
    // });

    // Cancel the session expiration timer
    clearSessionExpiration(req.userId as string);

    // if (user.tokenExpiresAt === "") {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true, // Ensure the cookie is only accessible by the web server
      sameSite: "none", // Allow the cookie to be sent in cross-site requests
      secure: true, // Ensure the cookie is sent over HTTPS
    });
    // }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    const err = error as Error;
    console.error("Logout error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to logout. Please try again later.",
    });
  }
};

/**
 * Handles the email verification request.
 *
 * @param req - The request object containing the verification token.
 * @param res - The response object to send the result.
 * @returns A JSON response with the success status and user information if verified successfully, or an error message.
 */
export const emailVerify = async (req: Request, res: Response) => {
  // Get the verification token from the request parameters
  const { token } = req.params;

  try {
    // Check if the token is provided
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized123" });
    }

    // Decode the access token
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("Secret key not configured");
    }
    let decoded;
    if (secretKey) {
      decoded = jwt.verify(token, secretKey);
    }

    // Check if the user already exists and is signed up
    let user;
    if (typeof decoded === "object") {
      user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });
    }

    // If the email is not found
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "email not verified" });
    }

    // Make the user verified
    const verifiedUser = await prisma.user.update({
      where: { email: user.email },
      data: { verified: true },
    });

    // Create and save token in cookie
    createCookieToken(user, "user", res);

    // Prepare user information to be sent in the response
    const userInfo = {
      id: verifiedUser.id,
      firstName: verifiedUser.firstName,
      lastName: verifiedUser.lastName,
      agencyName: verifiedUser.agencyName,
      role: verifiedUser.role,
      logo: verifiedUser.logo,
      accountStatus: verifiedUser.accountStatus,
      verified: verifiedUser.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Send a success response with user information
    return res
      .status(200)
      .json({ success: true, message: "user verified", results: userInfo });
  } catch (error) {
    const err = error as Error;
    console.error("Email Verify error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to verify the email. Please try again later.",
    });
  }
};

/**
 * Sends an email verification to the user.
 *
 * @param req - The request object containing the user authentication information.
 * @param res - The response object to send the result.
 * @returns A JSON response with the success status and a message.
 */
export const sendEmailVerification = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Authorize the user
    const user = await checkUserAuth(req, res);

    // Check if user is already verified
    if (user && user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "user is already verified" });
    }

    // If not verified, send the email verification
    if (user) {
      sendEmailValidationToken(user);
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Check your email to verify your account",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Send email verification error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to send the email verification. Please try again later.",
    });
  }
};

/**
 * Send reset password request email.
 *
 * @param req - The request object containing the user's email in the request body.
 * @param res - The response object.
 * @returns The response object.
 */
export const sendResetPassword = async (req: Request, res: Response) => {
  // Extract email from request body
  const { email } = req.body;

  try {
    // Find user with the given email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found, return error response
    if (!user) {
      return res
        .status(400)
        .json({ success: false, validationErrors: "Email not found" });
    }

    // Send reset password email to the user
    sendResetPassEmail(user);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Check your email to reset your password",
    });
  } catch (error) {
    // Log and return error response
    const err = error as Error;
    console.error("Send email verification error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Failed to send the reset email request. Please try again later.",
    });
  }
};

/**
 * Reset password endpoint.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The response object.
 */
export const resetPassword = async (req: Request, res: Response) => {
  // Extract token and password from request parameters and body
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Verify token
    const secretKey = process.env.SECRET_KEY;
    let decoded;
    if (secretKey) {
      decoded = jwt.verify(token, secretKey);
    }

    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: (decoded as { email: string }).email },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    // Validate new password
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
            "New Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
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

    // Validate password and confirmPassword
    const { error } = schema.validate({
      password,
      confirmPassword,
    });
    if (error) {
      // Map validation errors to validationErrors object
      const validationErrors = error.details.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return res
        .status(400)
        .json({ success: false, validationErrors: validationErrors });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedPassword },
    });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(400).json({
        success: false,
        message:
          "The reset password link has expired. Please request a new one.",
      });
    }

    const err = error as Error;
    console.error("Reset password error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later.",
    });
  }
};

// ###################################
// ########### functions #############
// ###################################

// create token and save it in http-only cookie
async function createCookieToken(
  user: { id: string },
  type: "user" | "teamMember",
  res: Response
) {
  // generate access token using JWT
  const secretKey = process.env.SECRET_KEY;
  let token;
  if (secretKey) {
    token = jwt.sign({ id: user.id, type }, secretKey, { expiresIn: "1h" });
  }

  const expiredAt = 1000 * 60 * 60; // session expire after one hour

  // save the token in cookie using http-only
  // expires after one hour
  if (token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Ensure cookies are only sent over HTTPS
      sameSite: "none",
      maxAge: expiredAt,
    });

    // if all success track the expiration time of the session
    trackSessionExpiration(user.id, expiredAt);
  }
}

// email verification token
function sendEmailValidationToken(user: User) {
  // create a token to send the email verification
  const secretKey = process.env.SECRET_KEY;
  let token;
  if (secretKey) {
    token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "10m" });
  }

  // user full name
  const fullName = user.firstName + " " + user.lastName;

  // send email with the token
  if (token) sendEmail(user.email, token, fullName);
}

// send reset email token
function sendResetPassEmail(user: User) {
  // create a token to send the email verification
  const secretKey = process.env.SECRET_KEY;
  let token;
  if (secretKey) {
    token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "10m" });
  }

  // user full name
  const fullName = user.firstName + " " + user.lastName;

  // send email with the token
  if (token) sendResetPasswordEmail(user.email, token, fullName);
}
