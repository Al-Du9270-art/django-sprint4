import type { TLoginData, TRegisterData } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi } from '@/utils/burger-api';
import { setCookie } from '@/utils/cookie';
import type { TUser } from '@/utils/types';
import type { SerializedError } from '@reduxjs/toolkit';
import { getUserApi, registerUserApi, logoutApi } from '@/utils/burger-api';
import { deleteCookie } from '@/utils/cookie';
import { updateUserApi } from '@/utils/burger-api';
export const loginUser = createAsyncThunk('user/loginUser', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: SerializedError | null;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserError = action.error;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.loginUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});
