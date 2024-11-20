import { CreateTicketFormTypes } from "./definitions/myTicketsDefinitions";

export const ticketFormData: CreateTicketFormTypes = {
  description: "",
  seats: null,
  flightDates: [],
  segments: [
    {
      departure: {
        airportCode: "",
        city: "",
        country: "",
        airport: "",
      },
      arrival: {
        airportCode: "",
        city: "",
        country: "",
        airport: "",
      },
      flightNumber: "",
      carrier: "",
      departureTime: "",
      arrivalTime: "",
    },
  ],
  flightClasses: [
    {
      type: "economy",
      carryOnAllowed: null,
      carryOnWeight: null,
      checkedAllowed: null,
      checkedWeight: null,
      additionalFee: null,
      checkedFee: null,
      extraOffers: [],
      price: {
        adult: null,
        child: null,
        infant: null,
        tax: 0,
      },
    },
  ],
};

export const searchTicketFromData = {
  itinerary: "one way",
  from: "",
  to: "",
  flightDate: null,
  returnDate: null,
  flightClass: "Economy",
  passengers: { adults: 1, children: 0, infants: 0 },
};
