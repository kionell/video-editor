import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AspectRatio } from '../../core/Enums/AspectRatio';
import { IVideoPreviewState } from '../../core/State/IVideoPreviewState';

const initialState: IVideoPreviewState = {
  aspectRatio: 1,
  previewWidth: 1920,
  previewHeight: 1080,
  previewFrameRate: 60,
  isPlaying: false,
  isExpanded: false,
};

const PreviewSlice = createSlice({
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
} = PreviewSlice.actions;

export const PreviewReducer = PreviewSlice.reducer;
