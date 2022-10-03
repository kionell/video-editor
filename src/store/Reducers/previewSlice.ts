import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IVideoPreview } from '../../models/IVideoPreview';

const initialState: IVideoPreview = {
  isPlaying: false,
  isExpanded: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setExpanded(state, action: PayloadAction<boolean>) {
      state.isExpanded = action.payload;
    },
  }
});

export const { setPlaying, setExpanded } = previewSlice.actions;
export const previewReducer = previewSlice.reducer;
