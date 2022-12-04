import { MediaType } from '../Enums/MediaType';
import { ImageFile } from '../Files/ImageFile';
import { IImage } from './Types/IImage';
import { VisibleElement } from './VisibleElement';

/**
 * An image element that can be placed on a timeline track.
 */
export class ImageElement extends VisibleElement implements IImage {
  file: ImageFile;

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Image;

  constructor(file: ImageFile) {
    super();

    this.file = file;
  }
}
