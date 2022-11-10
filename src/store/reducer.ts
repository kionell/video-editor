import { combineReducers } from '@reduxjs/toolkit';
import { fileReducer } from './Reducers/fileSlice';
import { generalReducer } from './Reducers/generalSlice';
import { previewReducer } from './Reducers/previewSlice';
import { timelineReducer } from './Reducers/timelineSlice';

export const rootReducer = combineReducers({
  general: generalReducer,
  files: fileReducer,
  timeline: timelineReducer,
  preview: previewReducer,
});
