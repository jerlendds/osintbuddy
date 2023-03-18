import { LoginFormValues } from '@/routes/public/SigninPage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LS_USER_AUTH_KEY } from '../../services/api.service';
import AuthService from '../../services/auth.service';

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

const rememberState = JSON.parse(localStorage.getItem(LS_USER_AUTH_KEY) || '[]');

let initialState;

if (rememberState && rememberState?.token) {
  console.log(rememberState)
  initialState = {
    isAuthenticated: rememberState.isAuthenticated,
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
    const response = await AuthService.loginUser(user);
    if (response.status !== 200) throw Error(response.response.data.detail);
    if (response && response.data && response.data.token) {
      return {...response.data, user: response.user};
    }
  } catch (error) {
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
      const user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      console.log('reducer state.user >> ', state.user)
      state.user = {
        ...user,
      };
    });
  },
});

export const { logout } = authSlice.actions;

export const selectUser = (state: AuthState) => state.auth.user;
export const selectAuthenticated = (state: AuthState) => state.auth.isAuthenticated;
export const selectToken = (state: AuthState) => {
  if (state.auth.user) return state.auth.token;
  return null;
};

export default authSlice.reducer;
