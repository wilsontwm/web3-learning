import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBalance as getBalanceApi,
  topupBalance as topupBalanceApi,
  withdrawBalance as withdrawBalanceApi,
  transferBalance as transferBalanceApi,
} from "../../pages/api/simpleToken";

// Define a type for the slice state
interface WalletState {
  balance: number;
}

interface SetBalancePayload {
  amount: number;
}

// Define the initial state using that type
const initialState: WalletState = {
  balance: 0,
};

export const getBalance = createAsyncThunk(
  "wallet/getBalance",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await getBalanceApi();

      return resp;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const topupBalance = createAsyncThunk(
  "wallet/topupBalance",
  async (payload: { amount: number }, { rejectWithValue }) => {
    try {
      const resp = await topupBalanceApi(payload);
      return resp;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const withdrawBalance = createAsyncThunk(
  "wallet/withdrawBalance",
  async (payload: { amount: number }, { rejectWithValue }) => {
    try {
      const resp = await withdrawBalanceApi(payload);
      return resp;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const transferBalance = createAsyncThunk(
  "wallet/transferBalance",
  async (payload: { address: string; amount: number }, { rejectWithValue }) => {
    try {
      const resp = await transferBalanceApi(payload);
      return resp;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<SetBalancePayload>) => {
      state.balance = action.payload.amount;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getBalance.fulfilled, (state, action) => {
      state.balance = action.payload;
    });
    builder.addCase(getBalance.pending, (state, action) => {});
    builder.addCase(getBalance.rejected, (state, action) => {
      state.balance = 0;
    });
  },
});

export const { setBalance } = walletSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default walletSlice.reducer;
