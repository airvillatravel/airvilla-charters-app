import Joi, { CustomHelpers } from "joi";

// create ticket validation
export const createTicketValidation = Joi.object({
  description: Joi.optional().messages({
    "string.base": "Description should be a type of string",
  }),
  seats: Joi.number().required().positive().min(1).max(100).messages({
    "number.base": "Seats is required",
    "any.required": "Seats is required",
    "number.min": "Seats must be greater than or equal to 1",
    "number.max": "Seats must be less than or equal to 100",
    "string.empty": "Seats cannot be empty",
  }),
  createdBy: Joi.string().optional().messages({
    "string.base": "Created by should be a type of string",
    "string.empty": "Created by cannot be empty",
  }),
  flightDates: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "flightDates should be an array of strings",
    "array.min": "flightDates is required",
    "any.required": "flightDates is required",
  }),
  flightClasses: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid("economy", "premium economy", "business class", "first class")
          .required()
          .messages({
            "string.base": "type should be a type of string",
            "any.only":
              "type must be one of [economy, premium economy, business class, first class]",
            "any.required": "type is required",
            "string.empty": "type is required",
          }),
        carryOnAllowed: Joi.number().min(0).required().messages({
          "number.base": "Carry On Allowed is required",
          "number.min": "Carry On Allowed must be greater than or equal to 0",
          "any.required": "Carry On Allowed is required",
          "string.empty": "Carry On Allowed is required",
        }),
        carryOnWeight: Joi.number().min(0).required().messages({
          "number.base": "Carry On Weight is required",
          "any.required": "Carry On Weight is required",
          "string.empty": "Carry On Weight is required",
          "number.min": "Carry On Weight must be greater than or equal to 0",
        }),
        checkedAllowed: Joi.number().min(0).required().messages({
          "number.base": "Checked Allowed is required",
          "any.required": "Checked Allowed is required",
          "string.empty": "Checked Allowed is required",
          "number.min": "Checked Allowed must be greater than or equal to 0",
        }),
        checkedWeight: Joi.number().min(0).required().messages({
          "number.base": "Checked Weight is required",
          "any.required": "Checked Weight is required",
          "string.empty": "Checked Weight is required",
          "number.min": "Checked Weight must be greater than or equal to 0",
        }),
        checkedFee: Joi.number().min(0).required().messages({
          "number.base": "Checked Fee is required",
          "any.required": "Checked Fee is required",
          "string.empty": "Checked Fee is required",
          "number.min": "Checked Fee must be greater than or equal to 0",
        }),
        additionalFee: Joi.number().min(0).required().messages({
          "number.base": "Additional Fee is required",
          "any.required": "Additional Fee is required",
          "string.empty": "Additional Fee is required",
          "number.min": "Additional Fee must be greater than or equal to 0",
        }),
        extraOffers: Joi.array().items(
          Joi.object({
            name: Joi.string().allow(null).allow("").messages({
              "string.base": "name should be a type of string",
              "string.empty": "name cannot be empty",
            }),
            available: Joi.string()
              .allow(null)
              .allow("")
              .valid("yes", "no", "charge")
              .messages({
                "string.base": "Offer Available should be a type of string",
                "any.only": "Offer Available must be one of [yes, no, charge]",
                "string.empty": "Offer Available cannot be empty",
              }),
          })
        ),
        price: Joi.object({
          adult: Joi.number().required().messages({
            "number.base": "Adult price is required",
            "number.min": "Adult price must be greater than or equal to 0",
            "any.required": "Adult price is required",
            "string.empty": "Adult price is required",
          }),
          child: Joi.number().required().messages({
            "number.base": "Child price is required",
            "number.min": "Child price must be greater than or equal to 0",
            "any.required": "Child price is required",
            "string.empty": "Child price is required",
          }),
          infant: Joi.number().required().messages({
            "number.base": "Infant price is required",
            "number.min": "Infant price must be greater than or equal to 0",
            "any.required": "Infant price is required",
            "string.empty": "Infant price is required",
          }),
          tax: Joi.number().min(0).messages({
            "number.base": "Tax is required",
            "number.min": "tax must be greater than or equal to 0",
            "string.empty": "Tax is required",
          }),
        })
          .required()
          .messages({
            "any.required": "Price is required",
          }),
      })
    )
    .required()
    .messages({
      "any.required": "Flight Classes is required",
    }),
  segments: Joi.array()
    .items(
      Joi.object({
        flightNumber: Joi.string().required().messages({
          "string.base": "Flight number should be a type of string",
          "any.required": "Flight number is required",
          "string.empty": "Flight number is required",
        }),
        carrier: Joi.string().required().messages({
          "string.base": "Carrier should be a type of string",
          "any.required": "Carrier is required",
          "string.empty": "Carrier is required",
        }),
        departure: Joi.object({
          airportCode: Joi.string().required().messages({
            "string.base": "Airport Code should be a type of string",
            "any.required": "Airport Code is required",
            "string.empty": "Airport Code is required",
          }),
          country: Joi.string().required().messages({
            "string.base": "Country should be a type of string",
            "any.required": "Country is required",
            "string.empty": "Country is required",
          }),
          city: Joi.string().required().messages({
            "string.base": "City should be a type of string",
            "any.required": "City is required",
            "string.empty": "City is required",
          }),
          airport: Joi.string().required().messages({
            "string.base": "Airport should be a type of string",
            "any.required": "Airport is required",
            "string.empty": "Airport is required",
          }),
        })
          .required()
          .messages({
            "any.required": "Departure is required",
          }),
        arrival: Joi.object({
          airportCode: Joi.string().required().messages({
            "string.base": "Airport Code should be a type of string",
            "any.required": "Airport Code is required",
            "string.empty": "Airport Code is required",
          }),
          country: Joi.string().required().messages({
            "string.base": "Country should be a type of string",
            "any.required": "Country is required",
            "string.empty": "Country is required",
          }),
          city: Joi.string().required().messages({
            "string.base": "City should be a type of string",
            "any.required": "City is required",
            "string.empty": "City is required",
          }),
          airport: Joi.string().required().messages({
            "string.base": "Airport should be a type of string",
            "any.required": "Airport is required",
            "string.empty": "Airport is required",
          }),
        })
          .required()
          .messages({
            "any.required": "Arrival is required",
          }),
        departureTime: Joi.string().required().messages({
          "string.base": "Departure time should be a type of string",
          "any.required": "Departure time is required",
          "string.empty": "Departure time is required",
        }),
        arrivalTime: Joi.string().required().messages({
          "string.base": "Arrival time should be a type of string",
          "any.required": "Arrival time is required",
          "string.empty": "Arrival time is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Segments should be a type of array",
      "any.required": "Segments is required",
    }),
});

// update ticket validation
export const updateTicketValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "Flight Ticket id should be a type of string",
    "any.required": "Flight Ticket id is required",
    "string.empty": "Flight Ticket id cannot be empty",
  }),
  refId: Joi.string().required().messages({
    "string.base": "Reference Id should be a type of string",
    "any.required": "Reference Id is required",
    "string.empty": "Reference Id cannot be empty",
  }),
  flightDate: Joi.string().required().messages({
    "string.base": "Flight Date should be a type of string",
    "any.required": "Flight Date is required",
    "string.empty": "Flight Date cannot be empty",
  }),
  description: Joi.string().allow("").allow(null).optional().messages({
    "string.base": "Description should be a type of string",
  }),
  reasonMsg: Joi.string().allow("").allow(null).optional().messages({
    "string.base": "Reason msg should be a type of string",
  }),
  ticketHistoryLogs: Joi.array().allow(),
  ticketStatus: Joi.string().optional(),
  updated: Joi.boolean().optional(),
  seats: Joi.number().integer().min(0).max(100).required().messages({
    "number.base": "Seats cannot be empty",
    "number.min": "Seats must be greater than or equal to 0",
    "number.max": "Seats must be less than or equal to 100",
    "any.required": "Seats is required",
    "string.empty": "Seats cannot be empty",
  }),
  agencyAgent: Joi.any().optional().messages({
    "any.required": "Agency Agent is required",
    "string.empty": "Agency Agent cannot be empty",
  }),
  agencyAgentId: Joi.any().optional().messages({
    "any.required": "Agency Agent Id is required",
    "string.empty": "Agency Agent Id cannot be empty",
  }),
  ownerId: Joi.string().required().messages({
    "string.base": "Owner Id should be a type of string",
    "any.required": "Owner Id is required",
    "string.empty": "Owner Id cannot be empty",
  }),
  bookedSeats: Joi.any().optional().messages({
    "any.required": "Booked Seats is required",
    "string.empty": "Booked Seats cannot be empty",
  }),
  purchasedSeats: Joi.any().optional().messages({
    "any.required": "Purchased Seats is required",
    "string.empty": "Purchased Seats cannot be empty",
  }),
  departure: Joi.object({
    id: Joi.string().required().messages({
      "string.base": "Departure id should be a type of string",
      "any.required": "Departure id is required",
      "string.empty": "Departure id cannot be empty",
    }),
    airportCode: Joi.string().required().messages({
      "string.base": "Airport Code should be a type of string",
      "any.required": "Airport Code is required",
      "string.empty": "Airport Code cannot be empty",
    }),
    country: Joi.string().required().messages({
      "string.base": "Country should be a type of string",
      "any.required": "Country is required",
      "string.empty": "Country cannot be empty",
    }),
    city: Joi.string().required().messages({
      "string.base": "City should be a type of string",
      "any.required": "City is required",
      "string.empty": "City cannot be empty",
    }),
    airport: Joi.string().required().messages({
      "string.base": "Airport should be a type of string",
      "any.required": "Airport is required",
      "string.empty": "Airport cannot be empty",
    }),
  })
    .required()
    .messages({
      "any.required": "Departure is required",
    }),
  departureId: Joi.string().required().messages({
    "string.base": "departureId should be a type of string",
    "any.required": "departureId is required",
    "string.empty": "departureId cannot be empty",
  }),
  arrival: Joi.object({
    id: Joi.string().required().messages({
      "string.base": "Arrival id should be a type of string",
      "any.required": "Arrival id is required",
      "string.empty": "Arrival id cannot be empty",
    }),
    airportCode: Joi.string().required().messages({
      "string.base": "Airport Code should be a type of string",
      "any.required": "Airport Code is required",
      "string.empty": "Airport Code cannot be empty",
    }),
    country: Joi.string().required().messages({
      "string.base": "Country should be a type of string",
      "any.required": "Country is required",
      "string.empty": "Country cannot be empty",
    }),
    city: Joi.string().required().messages({
      "string.base": "City should be a type of string",
      "any.required": "City is required",
      "string.empty": "City cannot be empty",
    }),
    airport: Joi.string().required().messages({
      "string.base": "Airport should be a type of string",
      "any.required": "Airport is required",
      "string.empty": "Airport cannot be empty",
    }),
  })
    .required()
    .messages({
      "any.required": "Arrival is required",
    }),
  arrivalId: Joi.string().required().messages({
    "string.base": "arrivalId should be a type of string",
    "any.required": "arrivalId is required",
    "string.empty": "arrivalId cannot be empty",
  }),
  departureTime: Joi.string().required().messages({
    "string.base": "Departure time should be a type of string",
    "any.required": "Departure time is required",
    "string.empty": "Departure time cannot be empty",
  }),
  arrivalTime: Joi.string().required().messages({
    "string.base": "Arrival time should be a type of string",
    "any.required": "Arrival time is required",
    "string.empty": "Arrival time cannot be empty",
  }),
  duration: Joi.string().required().messages({
    "string.base": "Ticket Duration should be a type of string",
    "any.required": "Ticket Duration is required",
    "string.empty": "Ticket Duration cannot be empty",
  }),
  stops: Joi.number().min(0).required().messages({
    "number.base": "Stops should be a type of number",
    "number.positive": "Stops must be a positive number",
    "number.min": "Stops must be greater than or equal to 0",
    "any.required": "Stops is required",
    "string.empty": "Stops cannot be empty",
  }),
  createdAt: Joi.string().required().messages({
    "string.base": "createdAt should be a type of string",
    "any.required": "createdAt is required",
    "string.empty": "createdAt cannot be empty",
  }),
  updatedAt: Joi.string().required().messages({
    "string.base": "updatedAt should be a type of string",
    "any.required": "updatedAt is required",
    "string.empty": "updatedAt cannot be empty",
  }),
  flightClasses: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().allow("").allow(null).messages({
          "string.base": "Flight class id should be a type of string",
        }),
        flightTicketId: Joi.string().allow("").allow(null).messages({
          "string.base":
            "Flight Ticket id should be a type of string in segment",
          // "any.required": "Flight Ticket id is required in segment",
          // "string.empty": "Flight Ticket id cannot be empty in segment",
        }),
        type: Joi.string()
          .valid("economy", "premium economy", "business class", "first class")
          .required()
          .messages({
            "string.base": "type should be a type of string",
            "any.only":
              "type must be one of [economy, premium economy, business class, first class]",
            "any.required": "type is required",
            "string.empty": "type cannot be empty",
          }),
        carryOnAllowed: Joi.number().min(0).required().messages({
          "number.base": "Carry On Allowed is required",
          "number.min": "Carry On Allowed must be greater than or equal to 0",
          "any.required": "Carry On Allowed is required",
          "string.empty": "Carry On Allowed is required",
        }),
        carryOnWeight: Joi.number().min(0).required().messages({
          "number.base": "Carry On Weight is required",
          "any.required": "Carry On Weight is required",
          "string.empty": "Carry On Weight is required",
          "number.min": "Carry On Weight must be greater than or equal to 0",
        }),
        checkedAllowed: Joi.number().min(0).required().messages({
          "number.base": "Checked Allowed is required",
          "any.required": "Checked Allowed is required",
          "string.empty": "Checked Allowed is required",
          "number.min": "Checked Allowed must be greater than or equal to 0",
        }),
        checkedWeight: Joi.number().min(0).required().messages({
          "number.base": "Checked Weight is required",
          "any.required": "Checked Weight is required",
          "string.empty": "Checked Weight is required",
          "number.min": "Checked Weight must be greater than or equal to 0",
        }),
        checkedFee: Joi.number().min(0).required().messages({
          "number.base": "Checked Fee is required",
          "any.required": "Checked Fee is required",
          "string.empty": "Checked Fee is required",
          "number.min": "Checked Fee must be greater than or equal to 0",
        }),
        additionalFee: Joi.number().min(0).required().messages({
          "number.base": "Additional Fee is required",
          "any.required": "Additional Fee is required",
          "string.empty": "Additional Fee is required",
          "number.min": "Additional Fee must be greater than or equal to 0",
        }),
        extraOffers: Joi.array().items(
          Joi.object({
            id: Joi.string().allow("").allow(null).messages({
              "string.base": "Extra Offer Id should be a type of string",
            }),
            flightClassId: Joi.string().allow("").allow(null).messages({
              "string.base":
                "Flight Class Id should be a type of string in Extra Offer",
            }),
            name: Joi.string().required().messages({
              "string.base": "name should be a type of string",
              "any.required": "name is required",
              "string.empty": "name cannot be empty",
            }),
            available: Joi.string()
              .valid("yes", "no", "charge")
              .required()
              .messages({
                "string.base": "Offer Available should be a type of string",
                "any.only": "Offer Available must be one of [yes, no, charge]",
                "any.required": "Offer Available is required",
                "string.empty": "Offer Available cannot be empty",
              }),
          })
        ),
        price: Joi.object({
          id: Joi.string().allow("").allow(null).messages({
            "string.base": "Price id should be a type of string",
          }),
          adult: Joi.number().required().min(0).messages({
            "number.base": "Adult price is required",
            "number.min": "Adult price must be greater than or equal to 0",
            "any.required": "Adult price is required",
            "string.empty": "Adult price cannot be empty",
          }),
          child: Joi.number().required().min(0).messages({
            "number.base": "Child price is required",
            "number.min": "Child price must be greater than or equal to 0",
            "any.required": "Child price is required",
            "string.empty": "Child price cannot be empty",
          }),
          infant: Joi.number().required().min(0).messages({
            "number.base": "Infant price is required",
            "number.min": "Infant Price must be greater than or equal to 0",
            "any.required": "Infant price is required",
            "string.empty": "Infant price cannot be empty",
          }),
          tax: Joi.number().required().min(0).messages({
            "number.base": "Tax is required",
            "number.min": "tax must be greater than or equal to 0",
            "string.empty": "Tax cannot be empty",
          }),
          currency: Joi.string().valid("JOD").required().messages({
            "string.base": "Currency should be a type of string",
            "any.only": "Currency must be JOD",
            "string.empty": "Currency cannot be empty",
          }),
          flightClassId: Joi.string().allow(null).allow("").messages({
            "string.base":
              "Flight Class Id should be a type of string in Extra Offer",
          }),
        })
          .required()
          .messages({
            "any.required": "Price is required",
          }),
      })
    )
    .required()
    .messages({
      "any.required": "Flight Classes is required",
    }),
  segments: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().allow("").allow(null).messages({
          "string.base": "Segment id should be a type of string",
          // "any.required": "Segment id is required",
          // "string.empty": "Segment id cannot be empty",
        }),
        flightTicketId: Joi.string().allow("").allow(null).messages({
          "string.base":
            "Flight Ticket id should be a type of string in segment",
          // "any.required": "Flight Ticket id is required in segment",
          // "string.empty": "Flight Ticket id cannot be empty in segment",
        }),
        flightNumber: Joi.string().required().messages({
          "string.base": "Flight number should be a type of string",
          "any.required": "Flight number is required",
          "string.empty": "Flight number cannot be empty",
        }),
        carrier: Joi.string().required().messages({
          "string.base": "Carrier should be a type of string",
          "any.required": "Carrier is required",
          "string.empty": "Carrier cannot be empty",
        }),
        departure: Joi.object({
          id: Joi.string().allow("").allow(null).messages({
            "string.base": "Departure id should be a type of string",
            // "any.required": "Departure id is required",
            // "string.empty": "Departure id cannot be empty",
          }),
          airportCode: Joi.string().required().messages({
            "string.base": "Airport Code should be a type of string",
            "any.required": "Airport Code is required",
            "string.empty": "Airport Code cannot be empty",
          }),
          country: Joi.string().required().messages({
            "string.base": "Country should be a type of string",
            "any.required": "Country is required",
            "string.empty": "Country cannot be empty",
          }),
          city: Joi.string().required().messages({
            "string.base": "City should be a type of string",
            "any.required": "City is required",
            "string.empty": "City cannot be empty",
          }),
          airport: Joi.string().required().messages({
            "string.base": "Airport should be a type of string",
            "any.required": "Airport is required",
            "string.empty": "Airport cannot be empty",
          }),
        })
          .required()
          .messages({
            "any.required": "Departure is required",
          }),
        departureId: Joi.string().allow("").allow(null).messages({
          "string.base": "departureId should be a type of string",
          // "any.required": "departureId is required",
          // "string.empty": "departureId cannot be empty",
        }),
        arrival: Joi.object({
          id: Joi.string().allow("").allow(null).messages({
            "string.base": "Arrival id should be a type of string",
            // "any.required": "Arrival id is required",
            // "string.empty": "Arrival id cannot be empty",
          }),
          airportCode: Joi.string().required().messages({
            "string.base": "Airport Code should be a type of string",
            "any.required": "Airport Code is required",
            "string.empty": "Airport Code cannot be empty",
          }),
          country: Joi.string().required().messages({
            "string.base": "Country should be a type of string",
            "any.required": "Country is required",
            "string.empty": "Country cannot be empty",
          }),
          city: Joi.string().required().messages({
            "string.base": "City should be a type of string",
            "any.required": "City is required",
            "string.empty": "City cannot be empty",
          }),
          airport: Joi.string().required().messages({
            "string.base": "Airport should be a type of string",
            "any.required": "Airport is required",
            "string.empty": "Airport cannot be empty",
          }),
        })
          .required()
          .messages({
            "any.required": "Arrival is required",
          }),
        arrivalId: Joi.string().allow("").allow(null).messages({
          "string.base": "arrival Id should be a type of string",
          // "any.required": "arrivalId is required",
          // "string.empty": "arrivalId cannot be empty",
        }),
        departureTime: Joi.string().required().messages({
          "string.base": "Departure time should be a type of string",
          "any.required": "Departure time is required",
          "string.empty": "Departure time is required",
        }),
        arrivalTime: Joi.string().required().messages({
          "string.base": "Arrival time should be a type of string",
          "any.required": "Arrival time is required",
          "string.empty": "Arrival time is required",
        }),
        duration: Joi.string().allow("").allow(null).messages({
          "string.base": "Segmnet Duration should be a type of string",
          // "any.required": "Segmnet Duration is required",
          // "string.empty": "Segmnet Duration cannot be empty",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Segments should be a type of array",
      "any.required": "Segments is required",
    }),
  owner: Joi.object({
    id: Joi.string().required().messages({
      "string.base": "ID should be a type of string",
      "any.required": "ID is required",
      "string.empty": "ID cannot be empty",
    }),
    // firstName: Joi.string().required().messages({
    //   "string.base": "First name should be a type of string",
    //   "any.required": "First name is required",
    //   "string.empty": "First name cannot be empty",
    // }),
    // lastName: Joi.string().required().messages({
    //   "string.base": "Last name should be a type of string",
    //   "any.required": "Last name is required",
    //   "string.empty": "Last name cannot be empty",
    // }),
    // username: Joi.string().required().messages({
    //   "string.base": "Username should be a type of string",
    //   "any.required": "Username is required",
    //   "string.empty": "Username cannot be empty",
    // }),
    agencyName: Joi.string().allow(null).messages({
      "string.base": "Agency name should be a type of string",
    }),
    // email: Joi.string().email().required().messages({
    //   "string.base": "Email should be a type of string",
    //   "string.email": "Email must be a valid email",
    //   "any.required": "Email is required",
    //   "string.empty": "Email cannot be empty",
    // }),
    // hashedPassword: Joi.string().required().messages({
    //   "string.base": "Hashed password should be a type of string",
    //   "any.required": "Hashed password is required",
    //   "string.empty": "Hashed password cannot be empty",
    // }),
    // mobileNumber: Joi.string().required().messages({
    //   "string.base": "Mobile number should be a type of string",
    //   "any.required": "Mobile number is required",
    //   "string.empty": "Mobile number cannot be empty",
    // }),
    // nationality: Joi.string().required().messages({
    //   "string.base": "Nationality should be a type of string",
    //   "any.required": "Nationality is required",
    //   "string.empty": "Nationality cannot be empty",
    // }),
    // dateOfBirth: Joi.date().required().messages({
    //   "date.base": "Date of birth should be a valid date",
    //   "any.required": "Date of birth is required",
    // }),
    // gender: Joi.string().valid("male", "female", "other").required().messages({
    //   "string.base": "Gender should be a type of string",
    //   "any.required": "Gender is required",
    //   "any.only": "Gender must be one of [male, female, other]",
    //   "string.empty": "Gender cannot be empty",
    // }),
    logo: Joi.string().allow(null).messages({
      "string.base": "Logo should be a type of string",
    }),
    // avatar: Joi.string().allow(null).messages({
    //   "string.base": "Avatar should be a type of string",
    // }),
    // accountStatus: Joi.string()
    //   .valid("accepted", "pending", "rejected")
    //   .default("affiliate")
    //   .messages({
    //     "any.only":
    //       "accountStatus must be one of [accepted, pending, rejected].",
    //     "string.empty": "accountStatus cannot be empty",
    //   }),
    // role: Joi.string().required().messages({
    //   "string.base": "Role should be a type of string",
    //   "any.required": "Role is required",
    //   "string.empty": "Role cannot be empty",
    // }),
    // addressId: Joi.string().required().messages({
    //   "string.base": "Address ID should be a type of string",
    //   "any.required": "Address ID is required",
    //   "string.empty": "Address ID cannot be empty",
    // }),
    // verified: Joi.boolean().required().messages({
    //   "boolean.base": "Verified should be a type of boolean",
    //   "any.required": "Verified is required",
    // }),
    // createdAt: Joi.date().required().messages({
    //   "date.base": "Created at should be a valid date",
    //   "any.required": "Created at is required",
    // }),
    // updatedAt: Joi.date().required().messages({
    //   "date.base": "Updated at should be a valid date",
    //   "any.required": "Updated at is required",
    // }),
  }),
});
