import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_NAVBAR_WIDTH } from '../../constants';
import { IGeneralState } from '../../core/State/IGeneralState';
import {
  CategoryAction,
  CategoryWidthAction,
} from '../Interfaces/GeneralPayload';

const initialState: IGeneralState = {
  mediaCategory: null,
  mediaCategoryWidth: DEFAULT_NAVBAR_WIDTH,
  settingsCategory: null,
};

const GeneralSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setMediaCategory(state, action: CategoryAction) {
      if (state.mediaCategory !== action.payload) {
        state.mediaCategory = action.payload;
      }
      else {
        state.mediaCategory = null;
      }
    },

    setMediaCategoryWidth(state, action: CategoryWidthAction) {
      state.mediaCategoryWidth = action.payload;
    },

    setSettingsCategory(state, action: CategoryAction) {
      if (state.settingsCategory !== action.payload) {
        state.settingsCategory = action.payload;
      }
      else {
        state.settingsCategory = null;
      }
    },
  },
});

export const {
  setMediaCategory,
  setMediaCategoryWidth,
  setSettingsCategory,
} = GeneralSlice.actions;

export const GeneralReducer = GeneralSlice.reducer;
