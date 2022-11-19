import { combineReducers } from '@reduxjs/toolkit';
import { FileReducer } from './Reducers/FileSlice';
import { GeneralReducer } from './Reducers/GeneralSlice';
import { PreviewReducer } from './Reducers/PreviewSlice';
import { TimelineReducer } from './Reducers/TimelineSlice';

export const RootReducer = combineReducers({
  general: GeneralReducer,
  files: FileReducer,
  timeline: TimelineReducer,
  preview: PreviewReducer,
});
