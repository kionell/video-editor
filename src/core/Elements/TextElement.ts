import { SECONDARY_FONT } from '../../constants';
import { MediaType } from '../Enums/MediaType';
import { TextAlign, TextVerticalAlign } from '../Enums/TextAlign';
import { IText } from './Types/IText';
import { VisibleElement } from './VisibleElement';

/**
 * A text element that can be placed on a timeline track.
 */
export class TextElement extends VisibleElement implements IText {
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
	font = SECONDARY_FONT;

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
