import Joi from "joi";

export const travelerFormValidation = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name cannot be empty.",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name cannot be empty.",
  }),
  dateOfBirth: Joi.date().required().messages({
    "date.base": "Date of birth should be a type of date",
    "any.required": "Date of birth is required",
  }),
  nationality: Joi.string().required().messages({
    "string.empty": "Nationality cannot be empty.",
  }),
  passportNumber: Joi.string().required().messages({
    "string.empty": "Passport number cannot be empty.",
  }),
  passportIssuingCountry: Joi.string().required().messages({
    "string.empty": "Passport issuing country cannot be empty.",
    "any.required": "Passport expiry is required",
  }),
  passportExpiry: Joi.date().required().messages({
    "date.base": "Passport expiry should be a type of date",
    "any.required": "Passport expiry is required",
  }),
});
