import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@src/app/store';
import { LS_USER_KEY, lUserDefault } from '@src/app/baseApi';
import { lStorage } from '@src/app/utilities';
import { useNavigate } from 'react-router-dom';
import { StepType } from '@reactour/tour';

export type DashboardTab = 'entities' | 'market' | 'graphs'

export interface Account {
  showSidebar: boolean;
  isAuthenticated: boolean;
  activeTour: StepType[]
}

let ACCOUNT_INIT = lStorage(LS_USER_KEY)
if (!ACCOUNT_INIT) ACCOUNT_INIT = lStorage(LS_USER_KEY, lUserDefault(false))

const initialState: Account = {
  isAuthenticated: ACCOUNT_INIT?.isAuthenticated,
  showSidebar: true,
  activeTour: []
};

export const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem(LS_USER_KEY)
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
    setGraphTour: (state) => {
      state.activeTour = [
        {
          selector: "#main-view",
          content:
            "Welcome to OSINTBuddy, this is your graph where you can start with one data point and continue mining for more related information.",
        },
        {
          selector: "#node-options-tour",
          content:
            "These are entities, the building blocks of an investigation. You can try resizing (bottom right) the entities panel or toggle the lock (top right) to move the panel around your screen. When ready make sure the entities panel is locked and try dragging an entity to the graph to get started. Once you have an entity on your graph you can right click the entity to transform it into new data.",
        },
      ];
    },
    setIntroTour: (state) => {
      // TODO, introduce the main UI of osintbuddy on first startup
    },
    setTourSteps: (state, action) => {
      state.activeTour = action.payload
    }
  },
});

export const { 
  closeSidebar,
  openSidebar,
  setSidebar,
  setIsAuthenticated,
  signOut,
  setGraphTour,
  setTourSteps,
  setIntroTour 
} = account.actions;

export const selectIsSidebarOpen = (state: RootState) => state.account.showSidebar;
export const selectIsAuthenticated = (state: RootState) => state.account.isAuthenticated;
export const selectActiveTour = (state: RootState) => state.account.activeTour;

export default account.reducer;
