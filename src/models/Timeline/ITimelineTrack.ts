import { ITimelineElement } from '../Elements/ITimelineElement';
import { MediaType } from '../Enums/MediaType';

export interface ITimelineTrack {
	/**
   * Index of timeline track on the timeline track area.
   */
  index: number;
	
  /**
   * Type of this media.
   */
  type: MediaType;

  /**
   * Elements of this track.
   */
  elements: ITimelineElement[];
}
