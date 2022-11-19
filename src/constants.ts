import { ITimelineZoomState } from './models/Timeline/ITimelineZoomState';

export const TIMELINE_ZOOM_LEVELS: ITimelineZoomState[] = [
  { // 1x distance (minute 0 to minute 5, 5 segments).
    unit: 18000,
    zoom: 1 / 18000,
    segments: 5,
  },
  { // 1x distance (minute 0 to minute 3, 3 segments).
    unit: 10800,
    zoom: 1 / 10800,
    segments: 3,
  },
  { // 1x distance (minute 0 to minute 2, 2 segments).
    unit: 7200,
    zoom: 1 / 7200,
    segments: 2,
  },
  { // 1x distance (minute 0 to minute 1, 1 segment).
    unit: 3600,
    zoom: 1 / 3600,
    segments: 1,
  },
  { // 1x distance (second 0 to second 30, 2 segments).
    unit: 1800,
    zoom: 1 / 1800,
    segments: 2,
  },
  { // 1x distance (second 0 to second 15, 3 segments).
    unit: 900,
    zoom: 1 / 900,
    segments: 3,
  },
  { // 1x distance (second 0 to second 10, 2 segments).
    unit: 600,
    zoom: 1 / 600,
    segments: 2,
  },
  { // 1x distance (second 0 to second 5, 5 segments).
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
  { // 1x distance (second 0 to second 3, 3 segments).
    unit: 180,
    zoom: 1 / 180,
    segments: 3,
  },
  { // 1x distance (second 0 to second 2, 2 segments).
    unit: 120,
    zoom: 1 / 120,
    segments: 2,
  },
  { // 1x distance (second 0 to second 1, 1 segment).
    unit: 60,
    zoom: 1 / 60,
    segments: 1,
  },
  { // 1x distance (frame 0 to frame 30, 2 segments).
    unit: 30,
    zoom: 1 / 30,
    segments: 2,
  },
  { // 1x distance (frame 0 to frame 15, 3 segments).
    unit: 15,
    zoom: 1 / 15,
    segments: 3,
  },
  { // 1x distance (frame 0 to frame 10, 2 segments).
    unit: 10,
    zoom: 1 / 10,
    segments: 2,
  },
  { // 1x distance (frame 0 to frame 5, 5 segments).
    unit: 5,
    zoom: 1 / 5,
    segments: 5,
  },
  { // 1x distance (frame 0 to frame 3, 3 segments).
    unit: 3,
    zoom: 1 / 3,
    segments: 3,
  },
  { // 1x distance (frame 0 to frame 2, 2 segments).
    unit: 2,
    zoom: 1 / 2,
    segments: 2,
  },
  { // 1x distance (frame 0 to frame 1, 1 segment).
    unit: 1,
    zoom: 1,
    segments: 1,
  },
  { // 2x distance (frame 0 to frame 1, 1 segment).
    unit: 1,
    zoom: 2,
    segments: 1,
  },
  { // 4x distance (frame 0 to frame 1, 1 segment).
    unit: 1,
    zoom: 4,
    segments: 1,
  },
];

export const GIANT_ICON_SIZE = 100;
export const LARGE_ICON_SIZE = 30;
export const NORMAL_ICON_SIZE = 20;
export const SMALL_ICON_SIZE = 14;

export const LARGER_FONT_SIZE = 30;
export const LARGE_FONT_SIZE = 24;
export const NORMAL_FONT_SIZE = 16;
export const SMALL_FONT_SIZE = 12;

export const DEFAULT_FONT = 'Roboto';
export const DEFAULT_WEIGHT = 'Regular';
export const SECONDARY_FONT = 'sans-serif';

export const PREVIEW_FRAME_WIDTH = 88;
export const TIMELINE_OFFSET_X = 40;

export const BASE_TIMELINE_ELEMENT_DURATION_MS = 4000;
