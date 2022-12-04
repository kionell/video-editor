import { IHasAudio } from './IHasAudio';
import { IPlayableElement } from './IPlayableElement';
import { IFadeableElement } from './IFadeableElement';
import { IFileElement } from './IFileElement';

export interface IAudio extends
  IPlayableElement,
  IHasAudio,
  IFileElement,
  IFadeableElement {}
