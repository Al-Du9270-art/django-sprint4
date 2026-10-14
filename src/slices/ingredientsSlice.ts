import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@/utils/types';
import * as api from '@api';
import type { SerializedError } from '@reduxjs/toolkit';

export const getIngredient = createAsyncThunk('ingredients/getAll', async () => {
  return api.getIngredientsApi();
});

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errorMessage: SerializedError | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  errorMessage: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredient.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error;
      })
      .addCase(getIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  },
});

export const { setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
