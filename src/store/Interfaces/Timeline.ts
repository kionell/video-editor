import { PayloadAction } from '@reduxjs/toolkit';
import { BaseElement } from '../../models/Elements/BaseElement';
import { ITimelineZoomState } from '../../models/State/ITimelineZoomState';
import { ITimelineScrollState } from '../../models/State/ITimelineScrollState';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';

interface TrackPayload {
  track: TimelineTrack;
}

interface TrackIndexPayload {
  trackIndex: number;
}

interface TrackIndexRangePayload {
  fromIndex: number;
  toIndex: number;
}

interface ElementPayload {
  element: BaseElement;
}

interface TimePayload {
  timeMs: number;
}

interface TimeRangePayload {
  fromMs: number;
  toMs: number;
}

export type SnapModePayload = boolean;
export type CurrentTimePayload = number;
export type CurrentZoomPayload = ITimelineZoomState;
export type CurrentScrollPayload = ITimelineScrollState;
export type AddTrackPayload = TrackPayload;
export type RemoveTrackPayload = TrackIndexPayload;
export type MoveTrackPayload = TrackIndexRangePayload;
export type BringForwardPayload = TrackIndexPayload;
export type SendBackwardPayload = TrackIndexPayload;
export type FixOffsetPayload = TrackIndexPayload;
export type FocusElementPayload = ElementPayload;
export type PushElementPayload = ElementPayload;
export type AddElementPayload = ElementPayload & TrackIndexPayload;
export type RemoveElementPayload = TimePayload & TrackIndexPayload;
export type MoveElementPayload = TimeRangePayload & TrackIndexPayload;

export type SnapModeAction = PayloadAction<SnapModePayload>;
export type CurrentTimeAction = PayloadAction<CurrentTimePayload>;
export type CurrentZoomAction = PayloadAction<CurrentZoomPayload>;
export type CurrentScrollAction = PayloadAction<CurrentScrollPayload>;
export type AddTrackAction = PayloadAction<AddTrackPayload>;
export type RemoveTrackAction = PayloadAction<RemoveTrackPayload>;
export type MoveTrackAction = PayloadAction<MoveTrackPayload>;
export type BringForwardAction = PayloadAction<BringForwardPayload>;
export type SendBackwardAction = PayloadAction<SendBackwardPayload>;
export type FixOffsetAction = PayloadAction<FixOffsetPayload>;
export type FocusElementAction = PayloadAction<FocusElementPayload>;
export type PushElementAction = PayloadAction<PushElementPayload>;
export type AddElementAction = PayloadAction<AddElementPayload>;
export type RemoveElementAction = PayloadAction<RemoveElementPayload>;
export type MoveElementAction = PayloadAction<MoveElementPayload>;
