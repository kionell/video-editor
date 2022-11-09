import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AspectRatio } from '../../models/Enums/AspectRatio';
import { IVideoPreview } from '../../models/IVideoPreview';

const initialState: IVideoPreview = {
  aspectRatio: 1,
  previewWidth: 1920,
  previewHeight: 1080,
  previewFrameRate: 60,
  isPlaying: false,
  isExpanded: false,
};

const previewSlice = createSlice({
  name: 'preview',
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

    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setExpanded(state, action: PayloadAction<boolean>) {
      state.isExpanded = action.payload;
    },
  },
});

export const {
  setAspectRatio,
  setPreviewWidth,
  setPreviewHeight,
  setPreviewFrameRate,
  setPlaying,
  setExpanded,
} = previewSlice.actions;

export const previewReducer = previewSlice.reducer;
