import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SidebarCategory } from '../../models/Enums/SidebarCategory';
import { IGeneralState } from '../../models/IGeneralState';

const initialState: IGeneralState = {
  currentCategory: 'None',
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setSidebarCategory(state, action: PayloadAction<keyof typeof SidebarCategory>) {
      state.currentCategory = action.payload;
    },
  },
});

export const {
  setSidebarCategory,
} = generalSlice.actions;

export const generalReducer = generalSlice.reducer;
