import { IHasAudio } from './IHasAudio';
import { IPlayableElement } from './IPlayableElement';
import { IFadeableElement } from './IFadeableElement';
import { IFileElement } from './IFileElement';
import { AudioFile } from '../../Files/AudioFile';

export interface IAudio extends
  IPlayableElement,
  IHasAudio,
  IFadeableElement,
  IFileElement<AudioFile> {}
