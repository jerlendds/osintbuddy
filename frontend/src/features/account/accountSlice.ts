import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import { LS_USER_KEY, lUserDefault } from '@/app/baseApi';
import { lStorage } from '@/app/utilities';
import { useNavigate } from 'react-router-dom';

export type DashboardTab = 'entities' | 'market' | 'graphs'

export interface Account {
  showSidebar: boolean;
  isAuthenticated: boolean;
  activeDashboardTab: DashboardTab;
}

let ACCOUNT_INIT = lStorage(LS_USER_KEY)
if (!ACCOUNT_INIT) ACCOUNT_INIT = lStorage(LS_USER_KEY, lUserDefault(false))

const initialState: Account = {
  isAuthenticated: ACCOUNT_INIT?.isAuthenticated,
  showSidebar: true,
  activeDashboardTab: 'graphs'
};

export const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem(LS_USER_KEY)
    },
    setActiveTab: (state, action: PayloadAction<DashboardTab>) => {
      state.activeDashboardTab = action.payload
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      if (action.payload === false) localStorage.removeItem(LS_USER_KEY)
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

export const { closeSidebar, openSidebar, setSidebar, setIsAuthenticated, signOut, setActiveTab } = account.actions;

export const isSidebarOpen = (state: RootState) => state.account.showSidebar;
export const selectActiveTab = (state: RootState) => state.account.activeDashboardTab;
export const selectIsAuthenticated = (state: RootState) => state.account.isAuthenticated;

export default account.reducer;
