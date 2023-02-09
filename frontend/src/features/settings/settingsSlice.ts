import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';

export interface Settings {
  showSidebar: boolean;
}

const initialState = {
  showSidebar: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
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

export const { closeSidebar, openSidebar, setSidebar } = settingsSlice.actions;

export const isSidebarOpen = (state: RootState) => state.settings.showSidebar;

export default settingsSlice.reducer;
