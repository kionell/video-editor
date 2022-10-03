import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AspectRatio } from '../../models/Enums/AspectRatio';
import { IGlobalSettings } from '../../models/IGlobalSettings';

const initialState: IGlobalSettings = {
   aspectRatio: 1,
   previewWidth: 1920,
   previewHeight: 1080,
   previewFrameRate: 60,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAspectRatio(state, action: PayloadAction<AspectRatio>) {
      state.aspectRatio = action.payload;
    },

    setPreviewWidth(state, action: PayloadAction<number>) {
      state.previewWidth = action.payload;
    },
   
    setPreviewHeight(state, action: PayloadAction<number>) {
      state.previewHeight = action.payload;
    },

    setPreviewFrameRate(state, action: PayloadAction<number>) {
      state.previewFrameRate = action.payload;
    },
  }
});

export const {
  setAspectRatio,
  setPreviewWidth,
  setPreviewHeight,
  setPreviewFrameRate,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
