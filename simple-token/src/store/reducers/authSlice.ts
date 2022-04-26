import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../../app/store";

// Define a type for the slice state
interface AuthState {
  currentAddress: string;
  connectorType: string;
  isActive: boolean;
  isActivating: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  currentAddress: "",
  connectorType: "",
  isActive: false,
  isActivating: false,
};

interface ActivatePayload {
  currentAddress: string;
  connectorType: string;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    activate: (state, action: PayloadAction<ActivatePayload>) => {
      state.currentAddress = action.payload.currentAddress;
      state.connectorType = action.payload.connectorType;
      state.isActive = true;
      state.isActivating = false;
    },
    activating: (state, action: PayloadAction<boolean>) => {
      state.isActivating = action.payload;
    },
    deactivate: (state) => {
      state.currentAddress = "";
      state.connectorType = "";
      state.isActive = false;
      state.isActivating = false;
    },
  },
});

export const { activate, activating, deactivate } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default authSlice.reducer;
