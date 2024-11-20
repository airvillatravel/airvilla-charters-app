import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { searchTicketFromData } from "@/utils/ticketFormData";

// default value
// const initialState: { value: SearchFormData } = {
const initialState: any = {
  value: searchTicketFromData,
  tickets: [],
  searchQuery: "",
  filteredTickets: [],
};

export const TicketSearchFormSlice = createSlice({
  name: "ticketSearchForm",
  initialState,
  reducers: {
    updateTicketSearchForm: (state, action: PayloadAction<any>) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },

    setTickets: (state: any, action: PayloadAction<any[]>) => {
      state.tickets = action.payload;
      state.filteredTickets = action.payload; // Initialize filtered tickets
    },

    updateSearchQuery: (state: any, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    applySearch: (state: any) => {
      state.filteredTickets = state.tickets.filter(
        (ticket: any) =>
          ticket.departure.airportCode
            .toLowerCase()
            .includes(state.value.from.toLowerCase()) &&
          ticket.arrival.airportCode
            .toLowerCase()
            .includes(state.value.to.toLowerCase())
      );
    },
    clearSearch: (state: any) => {
      state.searchQuery = "";
      state.filteredTickets = state.tickets;
    },
  },
});

export const {
  updateTicketSearchForm,
  setTickets,
  updateSearchQuery,
  applySearch,
  clearSearch,
} = TicketSearchFormSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSearchFormData = (state: RootState) =>
  state.ticketSearchForm.value;

export default TicketSearchFormSlice.reducer;
