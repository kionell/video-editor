import { VideoFile } from '../../Files/VideoFile';
import { IFileElement } from './IFileElement';
import { IHasAudio } from './IHasAudio';
import { IPlayableElement } from './IPlayableElement';
import { IVisible } from './IVisible';

export interface IVideo extends
  IPlayableElement,
  IVisible,
  IHasAudio,
  IFileElement<VideoFile> {}
