import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import { CasdoorUser } from '@/app/openapi';
import { LS_USER_AUTH_KEY } from '@/app/api';

export interface Account {
  showSidebar: boolean;
  isAuthenticated: boolean;
  user: CasdoorUser | null;
}

let INIT_DATA: any = localStorage.getItem(LS_USER_AUTH_KEY)
if (INIT_DATA === null) {
  INIT_DATA = { isAuthenticated: false, user: null }
} else {
  INIT_DATA = JSON.parse(INIT_DATA as string)
}

const initialState: Account = {
  isAuthenticated: INIT_DATA?.isAuthenticated,
  showSidebar: true,
  user: INIT_DATA?.user
};

export const account = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      if (action.payload === false) {
        state.user = null
      }
    },
    setUser: (state, action: PayloadAction<CasdoorUser | null>) => {
      state.user = action.payload
    },
    closeSidebar: (state) => {
      state.showSidebar = false;
    },
    openSidebar: (state) => {
      state.showSidebar = true;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
  },
});

export const { closeSidebar, openSidebar, setSidebar, setIsAuthenticated, setUser } = account.actions;

export const isSidebarOpen = (state: RootState) => state.account.showSidebar;

export const selectIsAuthenticated = (state: RootState) => state.account.isAuthenticated
export const selectUser = (state: RootState) => state.account.user

export default account.reducer;
