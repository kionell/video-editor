import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof store.getState>;