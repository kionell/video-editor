import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timeline } from '../../core/Timeline/Timeline';
import { TimelineTrack } from '../../core/Timeline/TimelineTrack';
import { getTrackByIndex } from '../../core/Utils/Timeline';
import { clamp } from '../../core/Utils/Math';

import {
  SnapModeAction,
  CurrentTimeAction,
  CurrentZoomAction,
  CurrentScrollAction,
  AddTrackAction,
  RemoveTrackAction,
  MoveTrackAction,
  FixOffsetAction,
  FocusElementAction,
  PushElementAction,
  AddElementAction,
  RemoveElementAction,
  MoveElementAction,
  MoveTrackPayload,
  PushElementPayload,
  FixOffsetPayload,
  RemoveElementPayload,
} from '../Interfaces/Timeline';

const initialState: Timeline = new Timeline();

function makeAction<T>(payload: T): PayloadAction<T> {
  return { type: '', payload } as PayloadAction<T>;
}

const TimelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setSnapMode(state, action: SnapModeAction) {
      state.snapMode = action.payload;
    },

    setCurrentTimeMs(state, action: CurrentTimeAction) {
      state.currentTimeMs = action.payload;
    },

    setCurrentScroll(state, action: CurrentScrollAction) {
      state.currentScroll = action.payload;
    },

    setCurrentZoom(state, action: CurrentZoomAction) {
      state.currentZoom = action.payload;
    },

    addTrack(state, action: AddTrackAction) {
      const track = action.payload.track;

      state.tracks.splice(track.index, 0, track);

      TimelineSlice.caseReducers.reindexTracks(state);
    },

    pushTrack(state) {
      state.tracks.push(new TimelineTrack(state.totalTracks));

      TimelineSlice.caseReducers.reindexTracks(state);
    },

    removeTrack(state, action: RemoveTrackAction) {
      const trackIndex = action.payload.trackIndex;

      if (trackIndex >= 0 && trackIndex < state.totalTracks) {
        state.tracks.splice(trackIndex, 1);

        TimelineSlice.caseReducers.reindexTracks(state);
      }
    },

    moveTrack(state, action: MoveTrackAction) {
      const fromIndex = action.payload.fromIndex;
      const toIndex = action.payload.toIndex;

      if (fromIndex >= 0 && fromIndex < state.totalTracks) {
        const index = clamp(toIndex, 0, state.totalTracks - 1);
        const track = state.tracks.splice(fromIndex, 1);

        state.tracks.splice(index, 0, track[0]);

        TimelineSlice.caseReducers.reindexTracks(state);
      }
    },

    bringForward(state) {
      const focusedTracks = state.focusedTracks;

      focusedTracks.forEach((track) => {
        const newAction = makeAction<MoveTrackPayload>({
          fromIndex: track.index,
          toIndex: track.index - 1,
        });

        TimelineSlice.caseReducers.moveTrack(state, newAction);
      });
    },

    sendBackward(state) {
      const focusedTracks = state.focusedTracks;

      focusedTracks.forEach((track) => {
        const newAction = makeAction<MoveTrackPayload>({
          fromIndex: track.index,
          toIndex: track.index + 1,
        });

        TimelineSlice.caseReducers.moveTrack(state, newAction);
      });
    },

    addElement(state, action: AddElementAction) {
      const element = action.payload.element;
      const trackIndex = action.payload.trackIndex;
      const track = getTrackByIndex(state as Timeline, trackIndex);

      if (!track) {
        const newAction = makeAction<PushElementPayload>({ element });

        TimelineSlice.caseReducers.pushElement(state, newAction);
      }
      else {
        track.addElement(element);

        const newAction = makeAction<FixOffsetPayload>({ trackIndex });

        TimelineSlice.caseReducers.fixTimeOffsets(state, newAction);
      }
    },

    pushElement(state, action: PushElementAction) {
      const element = action.payload.element;
      const newTrack = new TimelineTrack(0, element.type);

      newTrack.addElement(element);

      state.tracks.splice(newTrack.index, 0, newTrack);

      TimelineSlice.caseReducers.reindexTracks(state);
    },

    removeElement(state, action: RemoveElementAction) {
      const timeMs = action.payload.timeMs;
      const trackIndex = action.payload.trackIndex;
      const track = getTrackByIndex(state as Timeline, trackIndex);

      if (!track) return;

      track.removeElementAtTime(timeMs);
    },

    removeFocusedElements(state) {
      const focusedTracks = state.focusedTracks;

      focusedTracks.forEach((track) => {
        track.focusedElements.forEach((element) => {
          const newAction = makeAction<RemoveElementPayload>({
            trackIndex: track.index,
            timeMs: element.startTimeMs,
          });

          TimelineSlice.caseReducers.removeElement(state, newAction);
        });
      });
    },

    moveElement(state, action: MoveElementAction) {
      const { fromMs, toMs, trackIndex } = action.payload;
      const track = getTrackByIndex(state as Timeline, trackIndex);

      if (!track) return;

      track.moveElementFromTimeToTime(fromMs, toMs);
    },

    focusElement(state, action: FocusElementAction) {
      const element = action.payload.element;

      for (const track of state.tracks) {
        const targetElement = track.elements.find((e) => e.equals(element));

        if (targetElement) {
          targetElement.isFocused = true;

          return;
        }
      }
    },

    unfocusElement(state, action: FocusElementAction) {
      const element = action.payload.element;

      for (const track of state.tracks) {
        const targetElement = track.elements.find((e) => e.equals(element));

        if (targetElement) {
          targetElement.isFocused = false;

          return;
        }
      }
    },

    reindexTracks(state) {
      state.tracks.forEach((t, i) => t.index = i);
    },

    /**
     * Removes intersection between elements.
     */
    fixTimeOffsets(state, action: FixOffsetAction): void {
      const trackIndex = action.payload.trackIndex;
      const track = getTrackByIndex(state as Timeline, trackIndex);

      if (!track) return;

      track.elements.sort((a, b) => a.startTimeMs - b.startTimeMs);

      // There is no sense to change offsets when there are 1 element or less.
      if (track.elements.length <= 1) return;

      // Min starting time of each next element.
      let nextMinTime = track.elements[0].endTimeMs;

      track.elements.forEach((element, index) => {
        if (index === 0) return;

        const difference = element.startTimeMs - nextMinTime;

        // This means that our current element intersects with previous element.
        if (difference < 0) element.offsetMs -= difference;

        nextMinTime = element.endTimeMs;
      });
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
  moveTrack,
  bringForward,
  sendBackward,
  addElement,
  pushElement,
  removeElement,
  removeFocusedElements,
  moveElement,
  focusElement,
  unfocusElement,
} = TimelineSlice.actions;

export const TimelineReducer = TimelineSlice.reducer;
