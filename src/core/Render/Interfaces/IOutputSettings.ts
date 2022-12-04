import { BitrateEncoding } from '../Enums/BitrateEncoding';
import { FileFormat } from '../Enums/FileFormat';

export interface IOutputSettings {
  fileName?: string;
  fileFormat?: FileFormat;
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
