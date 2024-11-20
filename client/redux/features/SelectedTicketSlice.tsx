import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface SelectedTicket {
  ticketId: string;
  status: string;
}
// default value
const initialState: {
  value: SelectedTicket;
} = {
  value: {
    ticketId: "",
    status: "",
  },
};

export const selectedTicketSlice = createSlice({
  name: "selectedTicket",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<SelectedTicket>) => {
      const { ticketId, status } = action.payload;
      state.value = {
        ticketId,
        status,
      };
    },
  },
});

export const { setSelectedTicket } = selectedTicketSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedTicket = (state: RootState) =>
  state.selectedTicket.value;

export default selectedTicketSlice.reducer;
