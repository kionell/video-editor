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
  abstract element: HTMLElement;

  constructor(file: File) {
    this.name = file.name;
    this.type = file.type as MIMEType;
    this.size = file.size;
    this.url = URL.createObjectURL(file) + '#t=0.00001';
    this.lastModified = file.lastModified;
  }

  equals(other: UploadedFile): boolean {
    return this.name === other.name
      && this.type === other.type
      && this.size === other.size
      && this.lastModified === other.lastModified;
  }

  /**
   * Loads this file to the HTML element.
   */
  abstract load(): Promise<this>;

  abstract get duration(): number;
  abstract get hasDuration(): boolean;
}
