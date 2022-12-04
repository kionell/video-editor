import { BitrateEncoding } from '../Enums/BitrateEncoding';
import { FileType } from '../Enums/FileType';
import { FileFormat } from '../Enums/FileFormat';

export interface IOutputSettings {
  fileName?: string;
  fileType?: FileType;
  outputFormat?: FileFormat,
  includeVideo?: boolean;
  width?: number;
  height?: number;
  forceAspectRatio?: boolean;
  frameRate?: number;
  bitrateEncoding?: BitrateEncoding;
  bitrateMin?: number;
  bitrateMax?: number;
  twoPass?: boolean;
  includeAudio?: boolean;
  sampleRate?: number;
  audioBitrate?: number;
}

export type RequiredSettings = Required<IOutputSettings>;
