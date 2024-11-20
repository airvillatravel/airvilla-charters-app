// ################################ start common definitions ################################
export interface CommonProps {
  img: string;
}

export interface SegmentProps {
  segment: FlightSegmentRes;
}

export interface TicketProps {
  ticket: FlightTicketRes;
}

export interface FlightClassProps {
  flightClasses: FlightClassesRes;
}

export interface Location {
  id: number;
  airportCode: string;
  city: string;
  country: string;
  airport: string;
}

export const initialAirport: Location = {
  id: -1,
  airportCode: "",
  city: "",
  country: "",
  airport: "",
};
export interface SearchState {
  itinerary: "one way" | "round trip";
  departure: Location;
  arrival: Location;
  flightDate: string | null;
  returnDate: string | null;
  travelClass: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  price: { gr: number; ls: number };
  airlines: string[];
  layoverAirports: string[];
  stops: string[];
}

export const initialSearchState: SearchState = {
  itinerary: "one way",
  departure: initialAirport,
  arrival: initialAirport,
  flightDate: null,
  returnDate: null,
  travelClass: "Economy",
  passengers: { adults: 1, children: 0, infants: 0 },
  price: { gr: 0, ls: 0 },
  airlines: [],
  layoverAirports: [],
  stops: [],
};

// ################################ end common definitions ################################

// ################################ start definitions for Ticket ################################

// ################# Ticket form ##################
export interface TicketFormData {
  description: string;
  seats: number | null;
  flightDates: [];
  segments: SegmentFormData[];
  flightClasses: FlightClassesForm[];
}

// segment
export interface SegmentFormData {
  departure: LocationFormData;
  arrival: LocationFormData;
  flightNumber: string;
  carrier: string;
  departureTime: string;
  arrivalTime: string;
}

// location form data
export interface LocationFormData {
  airportCode: string;
  country: string;
  city: string;
  airport: string;
}

// flight classes form data
export interface FlightClassesForm {
  type: string;
  carryOnAllowed: number | null;
  carryOnWeight: number | null;
  checkedAllowed: number | null;
  checkedWeight: number | null;
  checkedFee: number | null;
  additionalFee: number | null;

  extraOffers: ExtraOffersForm[];
  price: FlightPriceForm;
}

// extra offers form
export interface ExtraOffersForm {
  name: string;
  available: string;
}

// price form
export interface FlightPriceForm {
  adult: number | null;
  child: number | null;
  infant: number | null;
  tax: number | null;
}

// ############################################

// new ticket res
export interface CreateTicketRes {
  success: boolean;
  message: string;
  validationErrors?: string[];
  results?: any;
}

export interface FlightTicketRes {
  agency: any;
  id: string;
  refId: string;
  ticketStatus: string;
  description: string;
  seats: number;
  flightDate: string;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  ownerId: string;
  agencyAgentId: string | null;
  ticketHistoryLogs: [];
  createdAt: string;
  updatedAt: string;
  departure: {
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
  arrival: {
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    agencyName: string | null;
    email: string;
    hashedPassword: string;
    mobileNumber: string;
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
  };
  agencyAgent: any; // Replace with a proper type if available
  bookedSeats: any[]; // Replace with a proper type if available
  flightClasses: FlightClassesRes[];
  segments: FlightSegmentRes[];
  purchasedSeats: any | null; // Replace with a proper type if available
}

export interface FlightSegmentRes {
  id: string;
  flightTicketId: string;
  flightNumber: string;
  flightDate: string;
  carrier: string;
  departureId: string;
  arrivalId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departure: {
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
  arrival: {
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
}

export interface FlightClassesRes {
  id: string;
  flightTicketId: string;
  type: string;
  carryOnAllowed: null | number;
  carryOnWeight: null | number;
  checkedAllowed: null | number;
  checkedWeight: null | number;
  additionalFee: null | number;
  checkedFee: null | number;
  // carryOnAllowed: number | null;
  // carryOnWeight: number | null;
  // carryOnFee: number | null;
  // checkedAllowed: number | null;
  // checkedWeight: number | null;
  // checkedFee: number | null;
  // additionalFee: number | null;
  extraOffers: FlightExtraOfferRes[];
  price: {
    id: string;
    adult: number | null;
    child: number | null;
    infant: number | null;
    tax: number | null;
    currency: string;
    flightClassId: string;
  };
}

export interface FlightExtraOfferRes {
  id: string;
  flightClassId: string;
  name: string;
  available: string;
}

export interface Location {
  airportCode: string;
  country: string;
  city: string;
  airport: string;
}
// res
// LOGIN RES
export interface TicketRes {
  success: boolean;
  message: string;
  validationError?: string[];
  results?: FlightTicketRes;
}

export interface SearchFormData {
  itinerary: String;
  from: String;
  to: String;
  flightDate: string | null;
  returnDate?: string | null;
  flightClass: String;
  price: { gr: number; ls: number };
  airlines: string[] | null;
  layoverAirports: string[] | null;
  stops: string[] | null;
}

export interface TicketSearchState {
  [x: string]: any;
  value: SearchFormData;
  tickets: FlightTicketRes[];
  searchQuery: string;
  filteredTickets: FlightTicketRes[];
}
// ################################ start definitions for Ticket ################################

// ################################ start definitions for Modal ################################
export interface CancelModalProps extends TicketProps {
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FlightSegmentProps extends SegmentProps {
  stops: number;
  segmentClass: string;
}

export interface FlightDetailsProps {
  title: string;
  airportCode: string;
  time: string;
  date: string;
  airport: string;
}

export interface FlightDurationProps {
  duration: string;
  stops: number;
}

export interface FlightTabProps extends CommonProps, TicketProps {}

// ################################ end definitions for Modal ################################

// ################################ start definitions for SearchTicketsList ################################

export interface SearchSideBarFiltersProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  priceRange: { minPrice: number; maxPrice: number };
  // selectedFilters: SelectedFilters;
  // setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}

export interface TicketListProps {
  searchedTickets: {
    departureTicket: FlightTicketRes[];
    returnTicket: FlightTicketRes[];
  };
  searchState: SearchState;
  onSelectTicket: (ticket: FlightTicketRes, isReturnFlight: boolean) => void;
  selectedDeparture: string | null;
  selectedReturn: string | null;
  getTicketState: (
    ticketId: string,
    isReturnFlight: boolean
  ) => "select" | "selected";
  combinedId: string;
}

export interface TicketDetailsProps {
  ticket: FlightTicketRes;
  ref: React.RefObject<HTMLDivElement> | null;
  searchState: SearchState;
  selectedDeparture: string | null;
  selectedReturn: string | null;
  getTicketState: (
    ticketId: string,
    isReturnFlight: boolean
  ) => "select" | "selected";
  onSelect: (ticket: FlightTicketRes, isReturnFlight: boolean) => void;
  buttonState: "select" | "selected";
  combinedId: string;
}

export interface PriceBookingSectionProps {
  flightClass: FlightClassesRes;
  searchState: SearchState;
  ticket: FlightTicketRes;
  combinedId: string;
  onSelect: (ticket: FlightTicketRes, isReturnFlight: boolean) => void;
  selectedDeparture: string | null;
  selectedReturn: string | null;
  getTicketState: (
    ticketId: string,
    isReturnFlight: boolean
  ) => "select" | "selected";
  buttonText: string;
  buttonClass: string;
  setFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface OfferSectionProps {
  seats: number;
  refundable: FlightExtraOfferRes[];
}

export interface SearchTicketModalProps {
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ticket: FlightTicketRes;
}

export interface OverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface HeaderProps {
  onClose: () => void;
}

export interface FilterSectionProps {
  title: string;
  className: string;
  children: React.ReactNode;
}

export interface CheckboxFilterProps {
  // filters: { label: string; count?: number }[];
  filters: Array<{ label: string; count?: number }>;
  selectedFilters: Set<string>;
  onFilterChange: (value: string) => void;
}

export interface ToggleButtonProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

export interface PriceFilterProps {
  minValue: number;
  maxValue: number;
  minLimit: number;
  maxLimit: number;
  onMinChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onMaxChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onSliderChange: (min: number, max: number) => void;
  // onSliderChange: (min: number, max: number) => void;
}
// ################################ end definitions for SearchTicketsList ################################

// ################################ start definitions for SingleTicket (Traveler Form) ################################

export interface Errors {
  [key: string]: string;
}

export interface Traveler {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssuingCountry: string;
  passportExpiry: string;
  errors: Errors;
}

// ################################ end definitions for SingleTicket (Traveler Form)  ################################

// ################################ start definitions for SidebarFilters ################################

export interface TicketState {
  departureTickets: FlightTicketRes[];
  returnTickets: FlightTicketRes[];
  filteredDepartureTickets: FlightTicketRes[];
  filteredReturnTickets: FlightTicketRes[];
  priceRange: { minPrice: number; maxPrice: number };
  activeFilters: boolean;
  selectedFilters: {
    popularFilters: string[];
    departureStops: string[];
    returnStops: string[];
    preferredAirlines: string[];
    layoverAirports: string[];
    minPrice: number;
    maxPrice: number;
  };
}

export interface AirlineInfo {
  code: string;
  name: string;
  count: number;
}

export interface FilteredResults {
  departureTickets: FlightTicketRes[];
  returnTickets: FlightTicketRes[];
  filteredDepartureTickets: FlightTicketRes[];
  filteredReturnTickets: FlightTicketRes[];
}

export interface SelectedFilters {
  popularFilters: Set<string>;
  departureStops: Set<string>;
  returnStops: Set<string>;
  preferredAirlines: Set<string>;
  layoverAirports: Set<string>;
  minPrice: number;
  maxPrice: number;
}
// ################################ end definitions for SidebarFilters ################################
