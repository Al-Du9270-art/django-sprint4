import { describe, test, expect } from '@jest/globals';
import type { TIngredient } from '@/utils/types';

import ingredientsReducer, {
  getIngredient,
  setIngredients,
  initialState,
} from '@/slices/ingredientsSlice';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile',
};

describe('тесты slices ingredients', () => {
  test('reduce ingredientsSlice', () => {
    const action = { type: 'UNKNOWN' };
    const result = ingredientsReducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  test('setIngredients сохраняет массив в state.ingredients', () => {
    const action = setIngredients([mockIngredient]);
    const result = ingredientsReducer(undefined, action);

    expect(result.ingredients).toEqual([mockIngredient]);
  });

  test('getIngredient.pending устанавливает isLoading=true', () => {
    const action = getIngredient.pending('  ');
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.errorMessage).toBe(null);
  });

  test('getIngredient.fulfilled сохраняет ингредиенты и сбрасывает isLoading', () => {
    const loadingState = { ...initialState, isLoading: true };
    const action = getIngredient.fulfilled([mockIngredient], 'request-id');
    const result = ingredientsReducer(loadingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual([mockIngredient]);
    expect(result.errorMessage).toBe(null);
  });

test('getIngredient.rejected сохраняет ошибку и сбрасывает isLoading', () => {
  const loadingState = { ...initialState, isLoading: true };
  const error = { name: 'Error', message: 'Network error' };
  const action = getIngredient.rejected(error, 'request-id');
  const result = ingredientsReducer(loadingState, action);

  expect(result.isLoading).toBe(false);
  expect(result.errorMessage).toEqual(error);
});
});
