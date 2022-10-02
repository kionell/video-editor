import { MIMEType } from '../Enums/MIMEType';

/**
 * Describes a blob file uploaded via inputs.
 */
export abstract class UploadedFile {
  /**
   * File name.
   */
  name: string;

  /**
   * File MIME type.
   */
	type: MIMEType;

  /**
   * Size of the file in bytes.
   */
	size: number;

  /**
   * File last modify timestamp.
   */
	lastModified: number;

  /**
   * File blob URL.
   */
  url: string;

  /**
   * HTML element that will store file data.
   */
  abstract element: HTMLElement | HTMLMediaElement;

  constructor(file: File) {
    this.name = file.name;
    this.type = file.type as MIMEType;
    this.size = file.size;
    this.url = URL.createObjectURL(file);
    this.lastModified = file.lastModified;
  }

  /**
   * Loads this file to the HTML element.
   */
  abstract load(): void;
}