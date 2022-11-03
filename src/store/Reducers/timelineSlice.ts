import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseElement } from '../../models/Elements/BaseElement';
import { Timeline } from '../../models/Timeline/Timeline';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';

const initialState: Timeline = new Timeline();

interface TrackAddOperation {
  track: TimelineTrack;
}

interface TrackRemoveOperation {
  track?: TimelineTrack;
  index?: number;
}

interface TrackMoveOperation {
  track?: TimelineTrack;
  fromIndex?: number;
  toIndex: number;
} 

interface ElementAddOperation {
  track?: TimelineTrack;
  trackIndex?: number;
  element: BaseElement;
}

interface ElementRemoveOperation {
  track?: TimelineTrack;
  trackIndex?: number;
  element?: BaseElement;
  timeMs?: number;
}

interface ElementMoveOperation {
  track?: TimelineTrack;
  trackIndex?: number;
  element?: BaseElement;
  fromMs?: number;
  toMs: number;
}

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setCurrentTimeMs(state, action: PayloadAction<number>) {
      state.currentTimeMs = action.payload;
    },

    setCurrentZoom(state, action: PayloadAction<number>) {
      state.currentZoom = action.payload;
    },

    setCurrentScroll(state, action: PayloadAction<number>) {
      state.currentScroll = action.payload;
    },

    setSnapMode(state, action: PayloadAction<boolean>) {
      state.snapMode = action.payload;
    },

    addTrack(state, action: PayloadAction<TrackAddOperation>) {
      state.addTrack(action.payload.track);
    },

    removeTrack(state, action: PayloadAction<TrackRemoveOperation>) {
      if (action.payload.track) {
        state.removeTrack(action.payload.track);
      }
      else if (typeof action.payload.index === 'number') { 
        state.removeTrackByIndex(action.payload.index);
      }
    },

    moveTrack(state, action: PayloadAction<TrackMoveOperation>) {
      const payload = action.payload;
      
      if (payload.track) {
        state.moveTrack(payload.track, payload.toIndex);
      }
      else if (typeof payload.fromIndex === 'number') {
        state.moveTrackByIndex(payload.fromIndex, payload.toIndex);
      }
    },

    addElement(state, action: PayloadAction<ElementAddOperation>) {
      const payload = action.payload;
      
      if (!payload.element) return;

      const element = payload.element;
      const track = payload.track 
        ?? state.getTrackByIndex(payload.trackIndex as number)
        ?? state.addTrack(new TimelineTrack(0, element.type));

      track.addElement(payload.element);
    },

    removeElement(state, action: PayloadAction<ElementRemoveOperation>) {
      const payload = action.payload;
      
      if (!payload.track && typeof payload.trackIndex !== 'number') return;

      const track = payload.track 
        ?? state.getTrackByIndex(payload.trackIndex as number);

      if (!track) return;

      if (payload.element) {
        track.removeElement(payload.element);
      }
      else if (typeof payload.timeMs === 'number') {
        track.removeElementAtTime(payload.timeMs);
      }
    },

    moveElement(state, action: PayloadAction<ElementMoveOperation>) {
      const payload = action.payload;
      
      if (!payload.track && typeof payload.trackIndex !== 'number') return;

      const track = payload.track 
        ?? state.getTrackByIndex(payload.trackIndex as number);

      if (!track) return;

      if (payload.element) {
        track.moveElementToTime(payload.element, payload.toMs);
      }
      else if (typeof payload.fromMs === 'number') {
        track.moveElementFromTimeToTime(payload.fromMs, payload.toMs);
      }
    },
  }
});

export const {
  setCurrentTimeMs,
  setCurrentZoom,
  setCurrentScroll,
  setSnapMode,
  addTrack,
  removeTrack,
  moveTrack,
  addElement,
  removeElement,
  moveElement,
} = timelineSlice.actions;

export const timelineReducer = timelineSlice.reducer;