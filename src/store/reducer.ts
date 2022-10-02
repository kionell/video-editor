import { combineReducers } from '@reduxjs/toolkit';
import { fileReducer } from './Reducers/fileSlice';
import { timelineReducer } from './Reducers/timelineSlice';

export const rootReducer = combineReducers({
  files: fileReducer,
  timeline: timelineReducer,
});
