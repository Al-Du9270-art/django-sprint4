import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@/utils/burger-api';
import type { TFeedState } from '@/utils/types';

export const getFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  return await getFeedsApi();
});

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
});

export default feedSlice.reducer;
