import { createSlice } from '@reduxjs/toolkit';
import { IGeneralState } from '../../core/State/IGeneralState';
import { CategoryAction } from '../Interfaces/GeneralPayload';

const initialState: IGeneralState = {
  mediaCategory: 'Media',
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

      console.log(state.mediaCategory);
    },

    setSettingsCategory(state, action: CategoryAction) {
      if (state.settingsCategory !== action.payload) {
        state.settingsCategory = action.payload;
      }
      else {
        state.settingsCategory = null;
      }

      console.log(state.settingsCategory);
    },
  },
});

export const {
  setMediaCategory,
  setSettingsCategory,
} = GeneralSlice.actions;

export const GeneralReducer = GeneralSlice.reducer;
