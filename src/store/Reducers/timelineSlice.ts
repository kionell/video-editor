import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseElement } from '../../models/Elements/BaseElement';
import { ITimelineZoomLevel } from '../../models/Timeline/ITimelineZoomLevel';
import { Timeline } from '../../models/Timeline/Timeline';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';
import { clamp } from '../../utils/math';

const initialState: Timeline = new Timeline();

interface AddTrackOperation {
  track: TimelineTrack;
}

interface RemoveTrackOperation {
  track: TimelineTrack;
}

interface RemoveTrackByIndexOperation {
  index: number;
}

interface MoveTrackOperation {
  track: TimelineTrack;
  toIndex: number;
}

interface MoveTrackByIndexOperation {
  fromIndex: number;
  toIndex: number;
}

interface AddElementOperation {
  element: BaseElement;
  track?: TimelineTrack;
}

interface AddElementByIndexOperation {
  element: BaseElement;
  trackIndex?: number;
}

interface RemoveElementOperation {
  track: TimelineTrack;
  trackIndex: number;
  element: BaseElement;
  timeMs: number;
}

interface MoveElementOperation {
  track: TimelineTrack;
  trackIndex: number;
  element: BaseElement;
  fromMs: number;
  toMs: number;
}

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setSnapMode(state, action: PayloadAction<boolean>) {
      state.snapMode = action.payload;
    },

    setCurrentTimeMs(state, action: PayloadAction<number>) {
      state.currentTimeMs = action.payload;
    },

    setCurrentScroll(state, action: PayloadAction<number>) {
      state.currentScroll = action.payload;
    },

    setCurrentZoom(state, action: PayloadAction<ITimelineZoomLevel>) {
      state.currentZoom = action.payload;
    },

    addTrack(state, action: PayloadAction<AddTrackOperation>) {
      const track = action.payload.track;

      state.tracks.splice(track.index, 0, track);

      state.tracks.forEach((track, index) => {
        track.index = index;
      });
    },

    pushTrack(state) {
      state.tracks.push(new TimelineTrack(state.totalTracks));
    },

    removeTrack(state, action: PayloadAction<RemoveTrackOperation>) {
      const track = action.payload.track;
      const index = state.tracks.findIndex((t) => t.index === track.index);

      if (index >= 0 && index < state.totalTracks) {
        state.tracks.splice(index, 1);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });
      }
    },

    removeTrackByIndex(state, action: PayloadAction<RemoveTrackByIndexOperation>) {
      const index = action.payload.index;

      if (index >= 0 && index < state.totalTracks) {
        state.tracks.splice(index, 1);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });
      }
    },

    moveTrack(state, action: PayloadAction<MoveTrackOperation>) {
      const track = action.payload.track;
      const fromIndex = track.index;
      const toIndex = action.payload.toIndex;

      if (fromIndex >= 0 && fromIndex < state.totalTracks) {
        const index = clamp(toIndex, 0, state.totalTracks - 1);
        const track = state.tracks.splice(fromIndex, 1);

        state.tracks.splice(index, 0, track[0]);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });
      }
    },

    moveTrackByIndex(state, action: PayloadAction<MoveTrackByIndexOperation>) {
      const fromIndex = action.payload.fromIndex;
      const toIndex = action.payload.toIndex;

      if (fromIndex >= 0 && fromIndex < state.totalTracks) {
        const index = clamp(toIndex, 0, state.totalTracks - 1);
        const track = state.tracks.splice(fromIndex, 1);

        state.tracks.splice(index, 0, track[0]);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });
      }
    },

    addElement(state, action: PayloadAction<AddElementOperation>) {
      const element = action.payload.element;
      const track = action.payload.track;

      if (track) {
        track.addElement(element);
      }
      else {
        const newTrack = new TimelineTrack(0, element.type);

        state.tracks.splice(newTrack.index, 0, newTrack);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });

        newTrack.addElement(element);
      }
    },

    addElementByIndex(state, action: PayloadAction<AddElementByIndexOperation>) {
      const element = action.payload.element;
      const trackIndex = action.payload.trackIndex;
      const track = state.getTrackByIndex(trackIndex);

      if (track) {
        track.addElement(element);
      }
      else {
        const newTrack = new TimelineTrack(0, element.type);

        state.tracks.splice(newTrack.index, 0, newTrack);

        state.tracks.forEach((track, index) => {
          track.index = index;
        });

        newTrack.addElement(element);
      }
    },

    removeElement(state, action: PayloadAction<RemoveElementOperation>) {
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

    moveElement(state, action: PayloadAction<MoveElementOperation>) {
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
  },
});

export const {
  setSnapMode,
  setCurrentTimeMs,
  setCurrentScroll,
  setCurrentZoom,
  addTrack,
  pushTrack,
  removeTrack,
  removeTrackByIndex,
  moveTrack,
  moveTrackByIndex,
  addElement,
  addElementByIndex,
  removeElement,
  moveElement,
} = timelineSlice.actions;

export const timelineReducer = timelineSlice.reducer;
