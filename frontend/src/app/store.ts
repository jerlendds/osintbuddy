import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import account from '@/features/account/accountSlice';
import graph from '@/features/graph/graphSlice';
import dashboard from '@/features/dashboard/dashboardSlice';

const reducer = combineReducers({
  dashboard,
  account,
  graph,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
