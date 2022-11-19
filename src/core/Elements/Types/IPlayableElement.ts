/**
 * An element with finite duration that can be played.
 */
export interface IPlayableElement {
  /**
   * Playback speed of the element. 
   */
	speed: number;

  /**
   * Whether this element reversed or not.
   */
	reversed: boolean;
}