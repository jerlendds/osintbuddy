import { LS_USER_AUTH_KEY, sdk } from '@/app/api';
import { LoginFormValues } from '@/routes/public/SigninPage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface User {
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  fullName: string;
  id: number;
  modified: Date;
  created: Date;
}

export interface AuthState {
  auth: {
    isAuthenticated: boolean;
    token?: string;
    user?: User;
  };
}

const rememberState = JSON.parse(localStorage.getItem(LS_USER_AUTH_KEY) || '{}');

let initialState;

if (rememberState) {
  initialState = {
    isAuthenticated: true,
    token: rememberState.token,
    user: {
      ...rememberState.user,
    },
  };
} else {
  initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };
}

export const login = createAsyncThunk('auth/login', async (user: LoginFormValues, thunkAPI) => {
  try {
    const data = await sdk.login.loginAccessToken({
      username: user.email,
      password: user.password
    })
    if (data && data.token) {
      localStorage.setItem(LS_USER_AUTH_KEY, JSON.stringify(data));
      return data
    }
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const user = action?.payload;
      state.isAuthenticated = true;
      state.token = action?.payload?.token;
      state.user = {
        ...user,
      };
    });
  },
});

export const { logout } = authSlice.actions;

export const selectAuthenticated = (state: AuthState) => state.auth.isAuthenticated;
export const selectToken = (state: AuthState) => {
  if (state.auth.user) return state.auth.token;
  return null;
};

export default authSlice.reducer;
