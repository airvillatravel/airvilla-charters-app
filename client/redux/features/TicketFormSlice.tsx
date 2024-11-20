import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ticketFormData } from "@/utils/ticketFormData";
import { CreateTicketFormTypes } from "@/utils/definitions/myTicketsDefinitions";

// default value
export const initialState: { value: CreateTicketFormTypes } = {
  value: ticketFormData,
};

export const ticketFormSlice = createSlice({
  name: "ticketForm",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateTicketForm: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
    addFlightClassSection: (state) => {
      state.value.flightClasses.push({
        type: "economy",
        carryOnAllowed: null,
        carryOnWeight: null,
        checkedAllowed: null,
        checkedWeight: null,
        checkedFee: null,
        additionalFee: null,
        extraOffers: [],
        price: {
          adult: null,
          child: null,
          infant: null,
          tax: 0,
        },
      });
    },
    removeFlightClassSection: (state) => {
      state.value.flightClasses.pop();
    },
    addSegmentSection: (state) => {
      state.value.segments.push({
        //   departure: {
        //     airportCode: "AMM",
        //     city: "Amman",
        //     country: "Jordan",
        //     airport: "Queen Alia International Airport",
        //   },
        //   arrival: {
        //     airportCode: "IST",
        //     city: "Istanbul",
        //     country: "Turkey",
        //     airport: "Istanbul Airport",
        //   },
        //   flightNumber: "",
        //   carrier: "",
        //   departureTime: "00:00",
        //   arrivalTime: "00:00",
        // });
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
      });
    },
    removeSegmentSection: (state) => {
      state.value.segments.pop();
    },
    addExtraOffers: (state, action: PayloadAction<{ classIdx: number }>) => {
      const { classIdx } = action.payload;
      state.value.flightClasses[classIdx].extraOffers.push({
        name: "",
        available: "yes",
      });
    },
    removeExtraOffers: (
      state,
      action: PayloadAction<{ classIdx: number; offerIdx: number }>
    ) => {
      const { classIdx, offerIdx } = action.payload;

      const filteredOffers = state.value.flightClasses[
        classIdx
      ].extraOffers.filter((offer, index) => index !== offerIdx);

      state.value.flightClasses[classIdx].extraOffers = filteredOffers;
    },
    resetSegmentLocation: (
      state,
      action: PayloadAction<{
        segmentIndex: number;
        act: "departure" | "arrival";
      }>
    ) => {
      const { segmentIndex, act } = action.payload;
      state.value.segments[segmentIndex][act] = {
        airportCode: "",
        city: "",
        country: "",
        airport: "",
      };
    },
  },
});

export const {
  updateTicketForm,
  addExtraOffers,
  addSegmentSection,
  addFlightClassSection,
  removeFlightClassSection,
  removeSegmentSection,
  removeExtraOffers,
  resetSegmentLocation,
} = ticketFormSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTicketForm = (state: RootState) => state.ticketForm.value;

export default ticketFormSlice.reducer;
