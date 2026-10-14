import type { TConstructorIngredient, TConstructorState } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createOrder } from '@/slices/orderSlice';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const item = state.ingredients[action.payload];
      state.ingredients[action.payload] = state.ingredients[action.payload - 1];
      state.ingredients[action.payload - 1] = item;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const item = state.ingredients[action.payload];
      state.ingredients[action.payload] = state.ingredients[action.payload + 1];
      state.ingredients[action.payload + 1] = item;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown,
} = constructorSlice.actions;
export default constructorSlice.reducer;
