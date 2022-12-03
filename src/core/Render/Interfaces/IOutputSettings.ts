export interface IOutputSettings {
  fileName?: string;
  width?: number;
  height?: number;
  frameRate?: number;
}

export type RequiredSettings = Required<IOutputSettings>;
