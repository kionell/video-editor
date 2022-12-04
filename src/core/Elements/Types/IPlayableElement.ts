import { IBaseElement } from './IBaseElement';

/**
 * An element with finite duration that can be played.
 */
export interface IPlayableElement extends IBaseElement {
  /**
   * Playback speed of the element. 
   */
	speed: number;
}
