import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FilteredResults,
  FlightTicketRes,
  TicketState,
} from "@/utils/definitions/blockseatsDefinitions";
import { calculateMinMaxPrices } from "@/utils/functions/functions";

const initialState: TicketState = {
  departureTickets: [],
  returnTickets: [],
  filteredDepartureTickets: [],
  filteredReturnTickets: [],
  priceRange: { minPrice: 0, maxPrice: 0 },
  activeFilters: false,
  selectedFilters: {
    departureStops: [],
    layoverAirports: [],
    minPrice: 0,
    maxPrice: 0,
    popularFilters: [],
    preferredAirlines: [],
    returnStops: [],
  },
};

export const ticketSlice = createSlice({
  name: "fetchedTicket",
  initialState,
  reducers: {
    setTickets: (
      state,
      action: PayloadAction<{
        departureTickets: FlightTicketRes[];
        returnTickets: FlightTicketRes[];
        filteredDepartureTickets: FlightTicketRes[];
        filteredReturnTickets: FlightTicketRes[];
      }>
    ) => {
      const {
        departureTickets,
        returnTickets,
        filteredDepartureTickets,
        filteredReturnTickets,
      } = action.payload;
      const { minPrice, maxPrice } = calculateMinMaxPrices(
        departureTickets,
        returnTickets
      );

      state.departureTickets = departureTickets;
      state.returnTickets = returnTickets;
      state.filteredDepartureTickets = filteredDepartureTickets;
      state.filteredReturnTickets = filteredReturnTickets;
      state.priceRange = { minPrice, maxPrice };
      state.activeFilters = false; // Reset filters when new tickets are set
      // Initialize selectedFilters with the full price range
      state.selectedFilters = {
        ...state.selectedFilters,
        minPrice,
        maxPrice,
      };
    },

    updateTicket: (state, action: PayloadAction<Partial<TicketState>>) => {
      Object.assign(state, action.payload);
      state.activeFilters =
        state.departureTickets.length > 0 || state.returnTickets.length > 0;
      state.departureTickets =
        action.payload.departureTickets ?? state.departureTickets;
      state.returnTickets = action.payload.returnTickets ?? state.returnTickets;
      state.filteredDepartureTickets =
        action.payload.filteredDepartureTickets ??
        state.filteredDepartureTickets;
      state.filteredReturnTickets =
        action.payload.filteredReturnTickets ?? state.filteredReturnTickets;
    },

    // updateTicket: (state, action: PayloadAction<FilteredResults>) => {
    //   state.departureTickets = action.payload.departureTickets;
    //   state.returnTickets = action.payload.returnTickets;
    //   state.filteredDepartureTickets = action.payload.filteredDepartureTickets;
    //   state.filteredReturnTickets = action.payload.filteredReturnTickets;
    // },

    // resetFilteredTickets: (state) => {
    //   state.departureTickets = initialState.departureTickets;
    //   state.returnTickets = initialState.returnTickets;
    //   state.filteredDepartureTickets = initialState.filteredDepartureTickets;
    //   state.filteredReturnTickets = initialState.filteredReturnTickets;
    //   state.activeFilters = false;
    // },

    setPriceRange: (
      state,
      action: PayloadAction<{ minPrice: number; maxPrice: number }>
    ) => {
      state.priceRange = action.payload;
    },

    // applyFilters: (
    //   state,
    //   action: PayloadAction<{
    //     filteredDepartureTickets: FlightTicketRes[];
    //     filteredReturnTickets: FlightTicketRes[];
    //   }>
    // ) => {
    //   const { filteredDepartureTickets, filteredReturnTickets } =
    //     action.payload;
    //   state.departureTickets = filteredDepartureTickets;
    //   state.returnTickets = filteredReturnTickets;
    //   state.activeFilters = true;
    // },
  },
});

export const {
  setTickets,
  updateTicket,
  // resetFilteredTickets,
  setPriceRange,
  // applyFilters,
} = ticketSlice.actions;

export default ticketSlice.reducer;
