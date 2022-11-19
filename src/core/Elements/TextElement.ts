import { MediaType } from '../Enums/MediaType';
import { TextAlign, TextVerticalAlign } from '../Enums/TextAlign';
import { VisibleElement } from './VisibleElement';

/**
 * A text element that can be placed on a timeline track.
 */
export class TextElement extends VisibleElement {
  /**
   * Text of this element.
   */
  text = 'Sample text';

  /**
   * Color of this text element.
   */
	color = 'white';

  /**
   * Size of the text.
   */
	size = 14;

  /**
   * Font family.
   */
	font = 'sans-serif';

  /**
   * Text align.
   */
	align: TextAlign = TextAlign.Left;

  /**
   * Text vertical align.
   */
	verticalAlign: TextVerticalAlign = TextVerticalAlign.Center;

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Text;
}
