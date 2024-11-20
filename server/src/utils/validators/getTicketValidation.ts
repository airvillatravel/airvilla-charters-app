import Joi from "joi";

export const searchTicketInputValidation = Joi.object({
  itinerary: Joi.string().required().messages({
    "string.base": "Itinerary data must be a string",
    "string.empty": "Itinerary data is required",
    "any.required": "Itinerary data is required",
  }),
  from: Joi.string().required().messages({
    "string.base": "From location must be a string",
    "string.empty": "From location is required",
    "any.required": "From location is required",
  }),
  to: Joi.string().required().messages({
    "string.base": "To location must be a string",
    "string.empty": "To location is required",
    "any.required": "To location is required",
  }),
  flightDate: Joi.string().required().messages({
    "string.base": "Flight date must be a string",
    "string.empty": "Flight date is required",
    "any.required": "Flight date is required",
  }),
  flightClass: Joi.string().required().messages({
    "string.base": "Flight Class must be a string",
    "string.empty": "Flight Class is required",
    "any.required": "Flight Class is required",
  }),
  returnDate: Joi.string()
    .optional()
    .allow(null, "")
    .when("itinerary", {
      is: "round trip",
      then: Joi.required().messages({
        "string.base": "Return date must be a string",
        "string.empty": "Return date is required for round trip",
        "any.required": "Return date is required for round trip",
      }),
    }),
  price: Joi.object({
    gr: Joi.number().required().min(0).messages({
      "number.base": "Price greater than or equal to must be a number",
      "number.min":
        "Price greater than or equal to must be greater than or equal to 0",
      "any.required": "Price greater than or equal to is required",
      "string.empty": "Price greater than or equal to is required",
    }),
    ls: Joi.number().required().min(0).messages({
      "number.base": "Price less than or equal to must be a number",
      "number.min":
        "Price less than or equal to must be greater than or equal to 0",
      "any.required": "Price less than or equal to is required",
      "string.empty": "Price less than or equal to is required",
    }),
  })
    .optional()
    .when("itinerary", {
      is: "round trip",
      then: Joi.required().messages({
        "any.required":
          "Price greater than or equal to and Price less than or equal to is required for round trip",
      }),
    }),
  airlines: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Airline must be an array of strings",
  }),
  layoverAirports: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "lLayover Airports must be an array of strings",
  }),
  stops: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Stops must be an array of numbers",
  }),
});
