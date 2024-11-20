import Joi from "joi";
import parsePhoneNumberFromString from "libphonenumber-js";

// Define the validation schema
export const searchMasterTicketInputValidation = Joi.object({
  refId: Joi.string().optional().messages({
    "string.base": "Reference Id should be a type of string",
    "string.empty": "Reference Id cannot be empty",
  }),
  agencyName: Joi.string().optional().messages({
    "string.base": "Agency Name should be a type of string",
    "string.empty": "Agency Name cannot be empty",
  }),
  username: Joi.string().optional().messages({
    "string.base": "Username should be a type of string",
    "string.empty": "Username cannot be empty",
  }),
});

export const userUpdateByMasterValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
  firstName: Joi.string().min(1).max(100).required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name cannot be empty",
    "string.min": "First name must be at least 1 character long",
    "string.max":
      "First name must be less than or equal to 100 characters long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(1).max(100).required().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must be less than or equal to 100 characters long",
    "any.required": "Last name is required",
  }),
  username: Joi.string().min(3).max(30).alphanum().required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be less than or equal to 30 characters long",
    "string.alphanum": "Username must only contain alphanumeric characters",
    "any.required": "Username is required",
  }),
  agencyName: Joi.string().allow(null).messages({
    "string.base": "Agency Name should be a type of text",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  hashedPassword: Joi.string().required().messages({
    "string.base": "Hashed password must be a string",
    "any.required": "Hashed password is required",
  }),

  phoneNumberVerified: Joi.boolean().required().messages({
    "boolean.base": "Phone number verified must be a boolean",
    "any.required": "Phone number verified is required",
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
      "string.base": "Phone number must be a string",
      "string.pattern.base": "Phone number must be a valid format",
      "any.required": "Phone number is required",
      "any.custom": "Invalid phone number",
    }),

  // tokenExpiresAt: Joi.string().optional().allow("").messages({
  //   "string.base": "Token expires at must be a string",
  // }),
  nationality: Joi.string().optional().allow("").messages({
    "string.base": "Nationality must be a string",
  }),
  dateOfBirth: Joi.string().optional().allow("").messages({
    "date.base": "Date of birth must be a valid date",
  }),
  gender: Joi.string().optional().allow("").required().messages({
    "string.base": "Gender must be a string",
  }),
  logo: Joi.string().allow(null).optional().messages({
    "string.base": "Logo must be a string",
  }),
  website: Joi.string().allow(null).optional().messages({
    "string.base": "Website must be a string",
  }),
  accountStatus: Joi.string()
    .valid("accepted", "pending", "rejected")
    .required()
    .messages({
      "string.base": "Account status must be a string",
      "string.valid":
        "Account status must be one of accepted, pending, or rejected",
      "any.required": "Account status is required",
    }),
  role: Joi.string().required().messages({
    "string.base": "Role must be a string",
    "any.required": "Role is required",
  }),
  addressId: Joi.string().required().messages({
    "string.base": "Address ID must be a string",
    "any.required": "Address ID is required",
  }),
  verified: Joi.boolean().required().messages({
    "boolean.base": "Verified must be a boolean",
    "any.required": "Verified is required",
  }),
  createdAt: Joi.date().required().messages({
    "date.base": "Creation date must be a valid date",
    "any.required": "Creation date is required",
  }),
  updatedAt: Joi.date().required().messages({
    "date.base": "Updated date must be a valid date",
    "any.required": "Updated date is required",
  }),
  myTickets: Joi.any().optional(),
  purchasedTickets: Joi.any().optional(),
  agents: Joi.any().optional(),
  iataNo: Joi.string().allow(null).allow("").optional().messages({
    "string.base": "IATA number must be a string",
  }),
  commercialOperationNo: Joi.string()
    .allow(null)
    .allow("")
    .optional()
    .messages({
      "string.base": "Commercial operation number must be a string",
    }),
  address: Joi.object({
    id: Joi.string().required().messages({
      "string.base": "Address ID must be a string",
      "any.required": "Address ID is required",
    }),
    country: Joi.string().required().messages({
      "string.base": "Country must be a string",
      "any.required": "Country is required",
    }),
    city: Joi.string().required().messages({
      "string.base": "City must be a string",
      "any.required": "City is required",
    }),
    street: Joi.string().allow(null).allow("").optional().messages({
      "string.base": "Street must be a string",
    }),
  })
    .required()
    .messages({
      "object.base": "Address must be an object",
      "any.required": "Address is required",
    }),
});
