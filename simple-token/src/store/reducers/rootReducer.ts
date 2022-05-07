import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { walletSlice } from "./walletSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  wallet: walletSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
