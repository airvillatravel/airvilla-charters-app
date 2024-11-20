// ############ MASTER USERS ##############
export interface MasterUsersResType {
  success: boolean;
  results?: {
    users: MasterUserResultType[];
    usersTotal: number | null;
    nextCursor?: string | null;
  };
}

export interface MasterSingleUserResType {
  success: boolean;
  message?: string;
  results: MasterUserResultType;
}
export interface MasterUserDataType {
  accountType: string;
  subscriptionStatus: string;
  registrationDateFilter: string;
  lastLoginFilter: string;
}
export interface TeamMemberDataType {
  accountType: string;
  department: string;
  registrationDateFilter: string;
  lastLoginFilter: string;
}
// USER TYPES
export interface UserAddressType {
  id: string;
  country: string;
  city: string;
  street: string;
}
export interface MasterUserResultType {
  id: string;
  refId: string;
  firstName: string;
  lastName: string;
  username: string;
  agencyName: string | undefined;
  email: string;
  hashedPassword: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  logo: string | null;
  avatar: string | null;
  accountStatus: string;
  role: string;
  addressId: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  address: UserAddressType;
  myTickets: any[];
  purchasedTickets: any[];
  agents: any[];
  iataNo?: string;
  commercialOperationNo?: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  website?: string;
  lastLogin?: string;
  subscriptionStatus: "active" | "inactive";
}

// ############ MASTER TICKETS ##############
export interface TicketRequestDataType {
  agencyName: string;
  airportCode: string;
  startDate: string;
  endDate: string;
  flightClassType: string;
  createdTimeFilter: string;
}

export interface MasterTicketsRes {
  success: boolean;
  messagre?: string;
  results: {
    tickets: MasterTicketResultType[];
    totalTickets: number | null;
    nextCursor: string | null;
  };
}

export interface MasterSingleTicketRes {
  success: boolean;
  message?: string;
  results: MasterTicketResultType;
}

export interface MasterAgencyNamesRes {
  success: boolean;
  message?: string;
  results: string[];
}

export interface MasterTicketResultType {
  id: string;
  refId: string;
  updated: boolean;
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
  departure: MasterAirportDetailResultType;
  arrival: MasterAirportDetailResultType;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    agencyName: string;
    logo: string | null;
  };
  agencyAgent: any | null;
  bookedSeats: any[];
  flightClasses: MasterFlightClassResultType[];
  ticketHistoryLogs: MasterTicketHistoryLogResultType[];
  segments: MasterSegmentResultType[];
  purchasedSeats: any | null;
}

export interface MasterAirportDetailResultType {
  id: string;
  airportCode: string;
  country: string;
  city: string;
  airport: string;
}

export interface MasterFlightClassResultType {
  id: string;
  type: string;
  carryOnAllowed: number | null;
  carryOnWeight: number | null;
  checkedAllowed: number | null;
  checkedWeight: number | null;
  checkedFee: number | null;
  additionalFee: number | null;
  flightTicketId: string;
  extraOffers: MasterExtraOffersResultType[];
  price: MasterPriceDetailsResultType;
}

export interface MasterExtraOffersResultType {
  id: string;
  name: string;
  available: string;
  flightClassId: string;
}

export interface MasterPriceDetailsResultType {
  id: string;
  adult: number | null;
  child: number | null;
  infant: number | null;
  tax: number | null;
  currency: string;
  flightClassId: string;
}

export interface MasterTicketHistoryLogResultType {
  changeType: string;
  changeDetails: string;
  changedAt: string;
  agency: MasterAgencyDetailsResultType | null;
  agencyAgent: any | null;
}

export interface MasterAgencyDetailsResultType {
  id: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  logo: string | null;
}

export interface MasterSegmentResultType {
  id: string;
  flightTicketId: string;
  flightNumber: string;
  carrier: string;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departure: MasterAirportDetailResultType;
  arrival: MasterAirportDetailResultType;
}
