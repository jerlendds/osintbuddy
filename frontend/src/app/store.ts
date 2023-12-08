import { configureStore, ThunkAction, Action, combineReducers, Middleware} from '@reduxjs/toolkit';
import account, { signOut } from '@src/features/account/accountSlice';
import graph from '@src/features/graph/graphSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import { rtkQueryAuthHandler } from './middleware';

const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  account,
  graph,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(rtkQueryAuthHandler)
});

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

