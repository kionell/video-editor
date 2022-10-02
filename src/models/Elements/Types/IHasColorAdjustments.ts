/**
 * An element that can have color adjustments.
 */
export interface IHasColorAdjustments {
  /**
   * Element exposure.
   */
  exposure: number;

  /**
   * Element saturation. 
   */
	saturation: number;

  /**
   * Element temperature. 
   */
	temperature: number;

  /**
   * Element constrast. 
   */
	constrast: number;

  /**
   * Element opacity. 
   */
	opacity: number;

  /**
   * Element blur. 
   */
	blur: number;
}