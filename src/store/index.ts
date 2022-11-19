import { configureStore } from '@reduxjs/toolkit';
import { RootReducer } from './Reducer';

export const store = configureStore({
  reducer: RootReducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof store.getState>;
