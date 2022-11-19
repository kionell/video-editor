import { configureStore } from '@reduxjs/toolkit';
import { RootReducer } from './Reducer';

export const Store = configureStore({
  reducer: RootReducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppStore = typeof Store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof Store.getState>;
