import { Bounds } from '../Bounds';

/**
 * An element that can be transformed.
 */
export interface ITransformableElement {
	/**
   * Element bounds.
   */
  bounds: Bounds;

  /**
   * Element rotation in degrees.
   */
  rotation: number;

  /**
   * Element scale.
   */
  scale: number;

  /**
   * Element zoom.
   */
	zoom: number;

  /**
   * Whether this element is fliped horizontally or not.
   */
	flipX: boolean;

  /**
   * Whether this element is fliped vertically or not.
   */
	flipY: boolean;
}
