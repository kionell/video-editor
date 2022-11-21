import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFile } from '../../core/Files/UploadedFile';
import { IFileState } from '../../core/State/IFileState';

const initialState: IFileState = {
  list: [],
};

const FileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    addFile(state, action: PayloadAction<UploadedFile>) {
      const found = state.list.find((f) => f.equals(action.payload));

      if (!found) {
        state.list.push(action.payload as any);
      }
    },

    removeFile(state, action: PayloadAction<UploadedFile>) {
      const index = state.list.findIndex((f) => f.equals(action.payload));

      if (index !== -1) {
        const file = state.list.splice(index, 1);

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
