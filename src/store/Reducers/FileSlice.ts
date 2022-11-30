import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFile } from '../../core/Files/UploadedFile';

const initialState: UploadedFile[] = [];

const FileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    addFile(state, action: PayloadAction<UploadedFile>) {
      const found = state.find((f) => f.equals(action.payload));

      if (!found) {
        state.push(action.payload as any);
      }
    },

    removeFile(state, action: PayloadAction<UploadedFile>) {
      const index = state.findIndex((f) => f.equals(action.payload));

      if (index !== -1) {
        const file = state.splice(index, 1);

        if (file[0]) file[0].remove();
      }
    },
  },
});

export const {
  addFile,
  removeFile,
} = FileSlice.actions;

export const FileReducer = FileSlice.reducer;
