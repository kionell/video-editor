import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_MEDIA_PANEL_WIDTH } from '../../constants';
import { IGeneralState } from '../../core/State/IGeneralState';
import {
  CategoryAction,
  CategoryWidthAction,
  ExportMenuVisibleAction,
} from '../Interfaces/GeneralPayload';

const initialState: IGeneralState = {
  mediaCategory: null,
  mediaPanelWidth: DEFAULT_MEDIA_PANEL_WIDTH,
  settingsCategory: null,
  showExportMenu: false,
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

    setMediaPanelWidth(state, action: CategoryWidthAction) {
      state.mediaPanelWidth = action.payload;
    },

    setSettingsCategory(state, action: CategoryAction) {
      if (state.settingsCategory !== action.payload) {
        state.settingsCategory = action.payload;
      }
      else {
        state.settingsCategory = null;
      }
    },

    setExportMenuVisible(state, action: ExportMenuVisibleAction) {
      state.showExportMenu = action.payload;
    },
  },
});

export const {
  setMediaCategory,
  setMediaPanelWidth,
  setSettingsCategory,
  setExportMenuVisible,
} = GeneralSlice.actions;

export const GeneralReducer = GeneralSlice.reducer;
