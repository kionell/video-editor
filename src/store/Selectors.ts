import { createSelector } from '@reduxjs/toolkit';
import { MediaType } from '../core/Enums/MediaType';
import { RootState } from './Store';

export const selectFiles = (state: RootState) => state.files;

const selectGeneral = (state: RootState) => state.general;

export const selectMediaCategory = createSelector(
  selectGeneral,
  (general) => general.mediaCategory,
);

export const selectMediaPanelWidth = createSelector(
  selectGeneral,
  (general) => general.mediaPanelWidth,
);

export const selectSettingsCategory = createSelector(
  selectGeneral,
  (general) => general.settingsCategory,
);

const selectPreview = (state: RootState) => state.preview;

export const selectAspectRatio = createSelector(
  selectPreview,
  (preview) => preview.aspectRatio,
);

export const selectIsExpanded = createSelector(
  selectPreview,
  (preview) => preview.isExpanded,
);

export const selectIsPlaying = createSelector(
  selectPreview,
  (preview) => preview.isPlaying,
);

export const selectPreviewFPS = createSelector(
  selectPreview,
  (preview) => preview.previewFrameRate,
);

export const selectPreviewWidth = createSelector(
  selectPreview,
  (preview) => preview.previewWidth,
);

export const selectPreviewHeight = createSelector(
  selectPreview,
  (preview) => preview.previewHeight,
);

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

export const selectTracks = createSelector(
  selectTimeline,
  (timeline) => timeline.tracks,
);

export const selectCurrentScroll = createSelector(
  selectTimeline,
  (timeline) => timeline.currentScroll,
);

export const selectScrollLeft = createSelector(
  selectTimeline,
  (timeline) => timeline.currentScroll.left,
);

export const selectCurrentZoom = createSelector(
  selectTimeline,
  (timeline) => timeline.currentZoom,
);

export const selectCurrentTimeMs = createSelector(
  selectTimeline,
  (timeline) => timeline.currentTimeMs,
);

export const selectTotalLengthMs = createSelector(
  selectTimeline,
  (timeline) => timeline.totalLengthMs,
);

export const selectTotalTracks = createSelector(
  selectTimeline,
  (timeline) => timeline.totalTracks,
);

export const selectSnapMode = createSelector(
  selectTimeline,
  (timeline) => timeline.snapMode,
);

export const selectIsEnded = createSelector(
  selectTimeline,
  (timeline) => timeline.ended,
);

export const selectLastSeekTimeMs = createSelector(
  selectTimeline,
  (timeline) => timeline.lastSeekTimeMs,
);
