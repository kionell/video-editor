/**
 * An element that can have color adjustments.
 */
export interface IHasColorAdjustments {
  /**
   * Element brightness.
   */
  brightness: number;

  /**
   * Element saturation. 
   */
	saturation: number;

  /**
   * Element temperature. 
   */
	temperature: number;

  /**
   * Element contrast. 
   */
	contrast: number;

  /**
   * Element opacity. 
   */
	opacity: number;

  /**
   * Element blur. 
   */
	blur: number;
}
