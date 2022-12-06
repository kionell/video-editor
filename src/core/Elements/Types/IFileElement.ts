import { UploadedFile } from '../../Files/UploadedFile';

/**
 * An element that is loaded from a file.
 */
export interface IFileElement<T extends UploadedFile> {
  /**
   * Uploaded file with loaded HTML element.
   */
	file: T;
}
