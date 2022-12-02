import { createSelector } from '@reduxjs/toolkit';
import { MediaType } from '../core/Enums/MediaType';
import { RootState } from './Store';

export const selectFiles = (state: RootState) => state.files;

export const selectMediaCategory = (state: RootState) => state.general.mediaCategory;
export const selectMediaPanelWidth = (state: RootState) => state.general.mediaPanelWidth;
export const selectSettingsCategory = (state: RootState) => state.general.settingsCategory;
export const selectShowExportMenu = (state: RootState) => state.general.showExportMenu;
export const selectAspectRatio = (state: RootState) => state.preview.aspectRatio;
export const selectIsExpanded = (state: RootState) => state.preview.isExpanded;
export const selectIsPlaying = (state: RootState) => state.preview.isPlaying;
export const selectPreviewFPS = (state: RootState) => state.preview.previewFrameRate;
export const selectPreviewWidth = (state: RootState) => state.preview.previewWidth;
export const selectPreviewHeight = (state: RootState) => state.preview.previewHeight;

const selectTimeline = (state: RootState) => state.timeline;

export const selectAllowBringForward = createSelector(
  selectTimeline,
  (timeline) => {
    const focusedTracks = timeline.focusedTracks;
    const totalTracks = timeline.totalTracks;
    const firstFocusedTrack = focusedTracks.at(0) ?? null;

    return !focusedTracks.length
      || totalTracks < 2
      || !firstFocusedTrack
      || firstFocusedTrack.index <= 0;
  },
);

export const selectAllowSendBackward = createSelector(
  selectTimeline,
  (timeline) => {
    const focusedTracks = timeline.focusedTracks;
    const totalTracks = timeline.totalTracks;
    const lastFocusedTrack = focusedTracks.at(-1) ?? null;

    return !focusedTracks.length
      || totalTracks < 2
      || !lastFocusedTrack
      || lastFocusedTrack.index >= totalTracks - 1;
  },
);

export const selectFocusedTracks = createSelector(
  selectTimeline,
  (timeline) => timeline.focusedTracks,
);

export const selectFocusedElement = createSelector(
  selectTimeline,
  (timeline) => timeline.focusedTracks[0]?.focusedElements[0],
);

export const selectFocusedElementType = createSelector(
  selectTimeline,
  (timeline) => {
    return timeline.focusedTracks[0]?.focusedElements[0]?.type
      ?? MediaType.Unknown;
  },
);

export const selectFocusedTotalTracks = createSelector(
  selectTimeline,
  (timeline) => timeline.focusedTracks.length,
);

export const selectTracks = (state: RootState) => state.timeline.tracks;
export const selectCurrentScroll = (state: RootState) => state.timeline.currentScroll;
export const selectScrollLeft = (state: RootState) => state.timeline.currentScroll.left;
export const selectCurrentZoom = (state: RootState) => state.timeline.currentZoom;
export const selectCurrentTimeMs = (state: RootState) => state.timeline.currentTimeMs;
export const selectTotalTracks = (state: RootState) => state.timeline.totalTracks;
export const selectSnapMode = (state: RootState) => state.timeline.snapMode;
export const selectLastSeekTimeMs = (state: RootState) => state.timeline.lastSeekTimeMs;

export const selectTotalLengthMs = createSelector(
  selectTimeline,
  (timeline) => timeline.totalLengthMs,
);

export const selectIsEnded = createSelector(
  selectTimeline,
  (timeline) => timeline.ended,
);
