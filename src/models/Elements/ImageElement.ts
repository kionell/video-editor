import { ImageFile } from '../Files/ImageFile';
import { IFileElement } from './Types/IFileElement';
import { VisibleElement } from './VisibleElement';

/**
 * An image element that can be placed on a timeline track.
 */
export class ImageElement extends VisibleElement implements IFileElement {
  file: ImageFile;

  constructor(options: Pick<ImageElement, 'file'> & Partial<ImageElement>) {
    super(options);

    this.file = options.file;
  }
}
