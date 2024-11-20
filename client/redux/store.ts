import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/AuthSlice";
import ActionMsgSlice from "./features/ActionMsgSlice";
import TicketFormSlice from "./features/TicketFormSlice";
import LoadingSlice from "./features/LoadingSlice";
import ticketSearchForm from "./features/TicketSearchSlice";
import selectedTicketSlice from "./features/SelectedTicketSlice";
import singleTicketSlice from "./features/SingleTicketSlice";
import ticketSlice from "./features/TicketSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: AuthSlice,
      actionMsg: ActionMsgSlice,
      ticketForm: TicketFormSlice,
      loading: LoadingSlice,
      ticketSearchForm: ticketSearchForm,
      selectedTicket: selectedTicketSlice,
      singleTicket: singleTicketSlice,
      fetchedTicket: ticketSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
