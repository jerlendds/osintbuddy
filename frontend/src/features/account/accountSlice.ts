import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import { CasdoorUser } from '@/app/openapi';
import { LS_USER_KEY } from '@/app/api';
import { useLocalStorage } from '@/components/utils';

export interface Account {
  showSidebar: boolean;
  isAuthenticated: boolean;
  user: CasdoorUser | null;
}

let ACCOUNT_INIT = useLocalStorage(LS_USER_KEY)
if (!ACCOUNT_INIT) ACCOUNT_INIT = useLocalStorage(LS_USER_KEY, { isAuthenticated: false, user: null })

const initialState: Account = {
  isAuthenticated: ACCOUNT_INIT?.isAuthenticated,
  showSidebar: true,
  user: ACCOUNT_INIT?.user
};

export const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      if (action.payload === false) {
        state.user = null
        localStorage.removeItem(LS_USER_KEY)
      }
    },
    setUser: (state, action: PayloadAction<CasdoorUser | null>) => {
      state.user = action.payload
      if (action.payload !== null) {
        state.isAuthenticated = true
        useLocalStorage(LS_USER_KEY, { isAuthenticated: true, user: action.payload})
      }
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
