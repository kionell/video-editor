/**
 * An element that can be transformed.
 */
export interface ITransformableElement {
  /**
   * Element rotation in degrees.
   */
  rotation: number;

  /**
   * Whether this element is fliped horizontally or not.
   */
	flipX: boolean;

  /**
   * Whether this element is fliped vertically or not.
   */
	flipY: boolean;
}
