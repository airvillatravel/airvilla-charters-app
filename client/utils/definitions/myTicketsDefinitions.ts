export interface UserTicketsRes {
  success: boolean;
  messagre?: string;
  results: {
    tickets: UserTicketResultType[];
    totalTickets: number | null;
    nextCursor: string | null;
  };
}

export interface UserSingleTicketRes {
  success: boolean;
  message?: string;
  results: UserTicketResultType;
}

export interface UserTicketResultType {
  id: string;
  refId: string;
  ticketStatus: string;
  description: string;
  seats: number | null;
  departureId: string;
  arrivalId: string;
  flightDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number | null;
  ownerId: string;
  agencyAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  updated: boolean;
  departure: UserAirportDetailResultType;
  arrival: UserAirportDetailResultType;
  owner: {
    id: string;
    agencyName: string;
    logo: string | null;
  };
  agencyAgent: any | null;
  bookedSeats: any[];
  flightClasses: UserFlightClassResultType[];
  ticketHistoryLogs: UserTicketHistoryLogResultType[];
  segments: UserSegmentResultType[];
  purchasedSeats: any | null;
}
export interface UserTicketResultType2 {
  id: string;
  refId: string;
  ticketStatus: string;
  description: string;
  seats: number | null;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number | null;
  ownerId: string;
  agencyAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  departure: UserAirportDetailResultType;
  arrival: UserAirportDetailResultType;
  owner: {
    id: string;
    agencyName: string;
    logo: string | null;
  };
  agencyAgent: any | null;
  bookedSeats: any[];
  flightClasses: UserFlightClassResultType[];
  ticketHistoryLogs: UserTicketHistoryLogResultType[];
  segments: UserSegmentResultType2[];
  purchasedSeats: any | null;
}

export interface UserAirportDetailResultType {
  id: string;
  airportCode: string;
  country: string;
  city: string;
  airport: string;
}

export interface UserFlightClassResultType {
  id: string;
  type: string;
  carryOnAllowed: number | null;
  carryOnWeight: number | null;
  checkedAllowed: number | null;
  checkedWeight: number | null;
  checkedFee: number | null;
  additionalFee: number | null;
  flightTicketId: string;
  extraOffers: UserExtraOffersResultType[];
  price: UserPriceDetailsResultType;
}

export interface UserExtraOffersResultType {
  id: string;
  name: string;
  available: string;
  flightClassId: string;
}

export interface UserPriceDetailsResultType {
  id: string;
  adult: number | null;
  child: number | null;
  infant: number | null;
  tax: number | null;
  currency: string;
  flightClassId: string;
}

export interface UserTicketHistoryLogResultType {
  changeType: string;
  changeDetails: string;
  changedAt: string;
  agency: UserAgencyDetailsResultType | null;
  agencyAgent: any | null;
}

export interface UserAgencyDetailsResultType {
  id: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  logo: string | null;
}

export interface UserSegmentResultType {
  id: string;
  flightTicketId: string;
  flightNumber: string;
  carrier: string;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departure: UserAirportDetailResultType;
  arrival: UserAirportDetailResultType;
  flightDate: string;
}
export interface UserSegmentResultType2 {
  id: string;
  flightTicketId: string;
  flightNumber: string;
  carrier: string;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departure: UserAirportDetailResultType;
  arrival: UserAirportDetailResultType;
}

export interface FilterFormDataType {
  airportCode: string;
  refId?: string;
  startDate: string;
  endDate: string;
  flightClassType: string;
  createdTimeFilter: string;
}

// Create and update ticket res

export interface CreateUpdateTicketRes {
  success: boolean;
  message?: string;
  results: UserTicketResultType;
  validationErrors?: string[];
}

// ############# Ticket form ################

export interface CreateTicketFormTypes {
  description: string;
  seats: number | null | null;
  flightDates: [];
  segments: CreateSegmentFormTypes[];
  flightClasses: CreateFlightClassesFormTypes[];
}

// segment
export interface CreateSegmentFormTypes {
  departure: CreateLocationFormTypes;
  arrival: CreateLocationFormTypes;
  flightNumber: string;
  carrier: string;
  departureTime: string;
  arrivalTime: string;
}

// location form data
export interface CreateLocationFormTypes {
  airportCode: string;
  country: string;
  city: string;
  airport: string;
}

// flight classes form data
export interface CreateFlightClassesFormTypes {
  type: string;
  carryOnAllowed: number | null | null;
  carryOnWeight: number | null | null;
  checkedAllowed: number | null | null;
  checkedWeight: number | null | null;
  checkedFee: number | null | null;
  additionalFee: number | null | null;

  extraOffers: CreateExtraOffersTypes[];
  price: CreateFlightPriceTypes;
}

// extra offers form
export interface CreateExtraOffersTypes {
  name: string;
  available: string;
}

// price form
export interface CreateFlightPriceTypes {
  adult: number | null | null;
  child: number | null | null;
  infant: number | null | null;
  tax: number | null | null;
}
