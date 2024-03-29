import { PayloadAction } from '@reduxjs/toolkit';
import { BaseElement } from '../../core/Elements/BaseElement';
import { IHasEverything } from '../../core/Elements/Types/IHasEverything';
import { ITimelineZoomState } from '../../core/State/ITimelineZoomState';
import { ITimelineScrollState } from '../../core/State/ITimelineScrollState';
import { TimelineTrack } from '../../core/Timeline/TimelineTrack';
import { UploadedFile } from '../../core/Files/UploadedFile';

interface FilePayload {
  file: UploadedFile;
}

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

export type CurrentTimePayload = number;
export type CurrentZoomPayload = ITimelineZoomState;
export type CurrentScrollPayload = ITimelineScrollState;
export type AddTrackPayload = TrackPayload;
export type RemoveTrackPayload = TrackIndexPayload;
export type MoveTrackPayload = TrackIndexRangePayload;
export type FixOffsetPayload = TrackIndexPayload;
export type FocusElementPayload = ElementPayload;
export type PushElementPayload = ElementPayload;
export type AddElementPayload = ElementPayload & TrackIndexPayload;
export type UpdateElementPayload = ElementPayload & Partial<IHasEverything>;
export type RemoveElementPayload = TimePayload & TrackIndexPayload;
export type RemoveElementsByFilePayload = FilePayload;
export type MoveElementPayload = TimeRangePayload & TrackIndexRangePayload;

export type CurrentTimeAction = PayloadAction<CurrentTimePayload>;
export type CurrentZoomAction = PayloadAction<CurrentZoomPayload>;
export type CurrentScrollAction = PayloadAction<CurrentScrollPayload>;
export type AddTrackAction = PayloadAction<AddTrackPayload>;
export type RemoveTrackAction = PayloadAction<RemoveTrackPayload>;
export type MoveTrackAction = PayloadAction<MoveTrackPayload>;
export type FixOffsetAction = PayloadAction<FixOffsetPayload>;
export type FocusElementAction = PayloadAction<FocusElementPayload>;
export type PushElementAction = PayloadAction<PushElementPayload>;
export type AddElementAction = PayloadAction<AddElementPayload>;
export type UpdateElementAction = PayloadAction<UpdateElementPayload>;
export type RemoveElementAction = PayloadAction<RemoveElementPayload>;
export type RemoveElementsByFileAction = PayloadAction<RemoveElementsByFilePayload>;
export type MoveElementAction = PayloadAction<MoveElementPayload>;
