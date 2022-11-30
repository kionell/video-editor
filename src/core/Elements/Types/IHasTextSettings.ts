import { TextAlign, TextVerticalAlign } from '../../Enums/TextAlign';

export interface IHasTextSettings {
  /**
   * Text of this element.
   */
  text: string;

  /**
   * Color of this text element.
   */
  color: string;

  /**
   * Size of the text.
   */
  size: number;

  /**
   * Font family.
   */
  font: string;

  /**
   * Text align.
   */
  align: TextAlign;

  /**
   * Text vertical align.
   */
  verticalAlign: TextVerticalAlign;
}
