import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  UserFlightClassResultType,
  UserTicketResultType,
  UserTicketResultType2,
} from "@/utils/definitions/myTicketsDefinitions";

// Define the initial state
const initialState: {
  value: UserTicketResultType | {};
} = {
  value: {},
};

export const singleTicketSlice = createSlice({
  name: "singleTicket",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTicketUpdateData: (state, action: PayloadAction<any>) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
    addSegmentToUpdateTicket: (state) => {
      (state.value as UserTicketResultType2).segments.push({
        id: "",
        flightTicketId: "",
        flightNumber: "",
        carrier: "",
        departureId: "",
        arrivalId: "",
        departureTime: "00:00",
        arrivalTime: "00:00",
        duration: "",
        departure: {
          id: "",
          airportCode: "",
          city: "",
          country: "",
          airport: "",
        },
        arrival: {
          id: "",
          airportCode: "",
          city: "",
          country: "",
          airport: "",
        },
      });
    },
    removeSegmentSectionToUpdateTicket: (state) => {
      (state.value as UserTicketResultType).segments.pop();
    },
    addFlightClassesToUpdateTicket: (state) => {
      (state.value as UserTicketResultType).flightClasses.push({
        id: "",
        type: "economy",
        carryOnAllowed: null,
        carryOnWeight: null,
        checkedAllowed: null,
        checkedWeight: null,
        additionalFee: null,
        checkedFee: null,
        flightTicketId: "",
        extraOffers: [
          {
            id: "",
            flightClassId: "",
            name: "",
            available: "yes",
          },
        ],
        price: {
          id: "",
          adult: null,
          child: null,
          infant: null,
          tax: 0,
          currency: "JOD",
          flightClassId: "",
        },
      });
    },
    addExtraOffersToUpdateTicket: (
      state,
      action: PayloadAction<{ classIdx: number }>
    ) => {
      const { classIdx } = action.payload;

      const flightClass: UserFlightClassResultType = (
        state.value as UserTicketResultType
      ).flightClasses[classIdx];

      flightClass.extraOffers.push({
        id: "",
        flightClassId: "",
        name: "",
        available: "yes",
      });
    },
    removeExtraOffersToUpdateTicket: (
      state,
      action: PayloadAction<{ classIdx: number; offerIdx: number }>
    ) => {
      const { classIdx, offerIdx } = action.payload;

      const filteredOffers = (
        state.value as UserTicketResultType
      ).flightClasses[classIdx].extraOffers.filter(
        (offer, index) => index !== offerIdx
      );

      (state.value as UserTicketResultType).flightClasses[
        classIdx
      ].extraOffers = filteredOffers;
    },
    addFlightClassSectionToUpdateTicket: (state) => {
      (state.value as UserTicketResultType).flightClasses.push({
        id: "",
        flightTicketId: "",
        type: "economy",
        carryOnAllowed: null,
        carryOnWeight: null,
        checkedAllowed: null,
        checkedWeight: null,
        checkedFee: null,
        additionalFee: null,
        extraOffers: [],
        price: {
          id: "",
          adult: null,
          child: null,
          infant: null,
          tax: 0,
          currency: "JOD",
          flightClassId: "",
        },
      });
    },
    removeFlightClassSectionToUpdateTicket: (state) => {
      (state.value as UserTicketResultType).flightClasses.pop();
    },
  },
});

export const {
  setTicketUpdateData,
  addSegmentToUpdateTicket,
  addFlightClassesToUpdateTicket,
  addFlightClassSectionToUpdateTicket,
  addExtraOffersToUpdateTicket,
  removeSegmentSectionToUpdateTicket,
  removeExtraOffersToUpdateTicket,
  removeFlightClassSectionToUpdateTicket,
} = singleTicketSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSingleTicket = (state: RootState) =>
  state.singleTicket.value;

export default singleTicketSlice.reducer;
