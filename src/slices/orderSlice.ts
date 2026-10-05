import type { TOrderState } from '@/utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@/utils/burger-api';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
};

export const orderSlice = createSlice({
  name: 'burgerOrder',
  initialState,
  reducers: {
    closeOrder: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      });
  },
});

export const { closeOrder } = orderSlice.actions;
