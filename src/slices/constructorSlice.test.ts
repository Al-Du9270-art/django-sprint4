import constructorReducer, {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown,
} from './constructorSlice';
import { createOrder } from './orderSlice';

import type { TConstructorIngredient, TConstructorState } from '@/utils/types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const mockBun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'id-bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
};

const mockIngredient1: TConstructorIngredient = {
  ...mockBun,
  _id: 'ing-1',
  id: 'id-ing-1',
  name: 'Котлета',
  type: 'main',
  price: 200,
};

const mockIngredient2: TConstructorIngredient = {
  ...mockBun,
  _id: 'ing-2',
  id: 'id-ing-2',
  name: 'Соус',
  type: 'sauce',
  price: 50,
};

const mockOrder = {
  _id: 'order-1',
  number: 12345,
  status: 'done',
  name: 'Бургер',
  createdAt: '',
  updatedAt: '',
  ingredients: [],
};

describe('тесты slices constructor', () => {
  test('reduce constructorSlice', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('setBun сохраняет булку в state.bun', () => {
    const result = constructorReducer(undefined, setBun(mockBun));

    expect(result.bun).toEqual(mockBun);
    expect(result.ingredients).toEqual([]);
  });

  test('addIngredient добавляет ингредиент в state.ingredients', () => {
    const result = constructorReducer(undefined, addIngredient(mockIngredient1));

    expect(result.ingredients).toEqual([mockIngredient1]);
    expect(result.bun).toBeNull();
  });

  test('removeIngredient удаляет ингредиент по id', () => {
    const prevState: TConstructorState = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const result = constructorReducer(prevState, removeIngredient('id-ing-1'));

    expect(result.ingredients).toEqual([mockIngredient2]);
    expect(result.bun).toEqual(mockBun);
  });

  test('clearConstructor очищает булку и ингредиенты', () => {
    const prevState: TConstructorState = {
      bun: mockBun,
      ingredients: [mockIngredient1],
    };
    const result = constructorReducer(prevState, clearConstructor());

    expect(result).toEqual(initialState);
  });

  test('moveIngredientUp меняет местами текущий с предыдущим', () => {
    const prevState: TConstructorState = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const result = constructorReducer(prevState, moveIngredientUp(1));

    expect(result.ingredients).toEqual([mockIngredient2, mockIngredient1]);
  });

  test('moveIngredientDown меняет местами текущий со следующим', () => {
    const prevState: TConstructorState = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const result = constructorReducer(prevState, moveIngredientDown(0));

    expect(result.ingredients).toEqual([mockIngredient2, mockIngredient1]);
  });

  test('createOrder.fulfilled очищает конструктор', () => {
    const prevState: TConstructorState = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2],
    };
    const action = createOrder.fulfilled(mockOrder, 'request-id', ['bun-1']);
    const result = constructorReducer(prevState, action);

    expect(result).toEqual(initialState);
  });
});