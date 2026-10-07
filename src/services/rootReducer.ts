import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from '@/slices/ingredientsSlice';
import { userSlice } from '@/slices/userSlice';
import { constructorSlice } from '@/slices/constructorSlice';
import { orderSlice } from '@/slices/orderSlice';
import { feedSlice } from '@/slices/feedSlice';
import { profileOrdersSlice } from '@/slices/profileOrdersSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  constructorSlice,
  orderSlice,
  feedSlice,
  profileOrdersSlice
);
