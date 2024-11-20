import { empty } from "@prisma/client/runtime/library";
import Joi from "joi";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// sign up validation
export const signupValidation = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "any.required": "First name is required",
    "string.base": "First name should be a type of text",
    "string.empty": "First name cannot be empty",
    "string.min": "First name should have a minimum length of 2",
    "string.max": "First name should have a maximum length of 30",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.base": "Last name should be a type of text",
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name should have a minimum length of 2",
    "string.max": "Last name should have a maximum length of 30",
    "any.required": "Last name is required",
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.alphanum": "Username must only contain alpha-numeric characters",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have a minimum length of 3",
    "string.max": "Username should have a maximum length of 30",
    "any.required": "Username is required",
  }),
  agencyName: Joi.string().allow("").messages({
    "string.base": "Agency Name should be a type of text",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(new RegExp("(?=.*[a-z])")) // at least one lowercase letter
    .pattern(new RegExp("(?=.*[A-Z])")) // at least one uppercase letter
    .pattern(new RegExp("(?=.*[0-9])")) // at least one digit
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // at least one special character
    .min(8) // minimum length 8
    .max(30) // maximum length 30
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 30 characters long",
      "string.empty": "Password cannot be empty",
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
  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      try {
        // Attempt to parse the phone number
        const phoneNumber = parsePhoneNumberFromString(value);

        // Check if phoneNumber exists and is valid
        if (!phoneNumber || !phoneNumber.isValid()) {
          return helpers.message({ custom: "Invalid phone number" });
        }

        // Return the parsed phone number in E.164 format
        return phoneNumber.format("E.164");
      } catch (err) {
        // Handle parsing errors
        return helpers.error("any.custom");
      }
    })
    .required()
    .messages({
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
      "any.custom": "Invalid phone number",
    }),
  nationality: Joi.string().allow("").messages({
    "string.empty": "Nationality cannot be empty",
  }),
  dateOfBirth: Joi.string().allow("").messages({
    "date.base": "Date of Birth must be a valid date",
  }),
  gender: Joi.string().allow("").valid("male", "female").required().messages({
    "any.only":
      "Gender must be one of the following values: male, female, other",
    "string.empty": "Gender cannot be empty",
  }),
  role: Joi.string().valid("affiliate", "agency").required().messages({
    "any.only": "Role must be one of the following values: affiliate, agency",
    "string.empty": "Role cannot be empty",
    "any.required": "Role is required",
  }),
  country: Joi.string().required().messages({
    "string.base": "Country should be a text",
    "any.required": "Country is required",
  }),
  city: Joi.string().required().messages({
    "string.base": "City should be a text",
    "any.required": "City is required",
  }),
  street: Joi.string().allow("").allow(null).optional().messages({
    "string.base": "street should be a text",
  }),
  iataNo: Joi.string().allow("").allow(null).optional().messages({
    "string.base": "iataNo should be a text",
  }),
  commercialOperationNo: Joi.string()
    .allow("")
    .allow(null)
    .optional()
    .messages({
      "string.base": "commercialOperationNo should be a text",
    }),

  website: Joi.string().allow("").allow(null).optional().messages({
    "string.base": "website should be a text",
  }),

  // Add more fields as needed
});

// login validation
export const loginValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Ensures basic email format
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
