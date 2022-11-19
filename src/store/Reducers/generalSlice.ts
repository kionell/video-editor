import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SidebarCategory } from '../../core/Enums/SidebarCategory';
import { IGeneralState } from '../../core/State/IGeneralState';

const initialState: IGeneralState = {
  currentCategory: 'None',
};

const GeneralSlice = createSlice({
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
} = GeneralSlice.actions;

export const GeneralReducer = GeneralSlice.reducer;
