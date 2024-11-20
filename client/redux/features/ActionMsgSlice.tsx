import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// msg type
interface ActionMsg {
  success: boolean | null;
  message: string | null;
}

// default value
const initialState: {
  value: ActionMsg;
} = {
  value: {
    success: null,
    message: null,
  },
};

export const actionMsgSlice = createSlice({
  name: "actionMsg",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMsg: (state, action: PayloadAction<ActionMsg>) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
  },
});

export const { setMsg } = actionMsgSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectActionMsg = (state: RootState) => state.actionMsg.value;

export default actionMsgSlice.reducer;
