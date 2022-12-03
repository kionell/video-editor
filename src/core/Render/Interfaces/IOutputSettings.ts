import { BitrateEncoding } from '../Enums/BitrateEncoding';

export interface IOutputSettings {
  fileName?: string;
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
