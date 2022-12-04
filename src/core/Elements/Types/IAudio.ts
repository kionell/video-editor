import { IHasAudio } from './IHasAudio';
import { IPlayableElement } from './IPlayableElement';
import { IFadeableElement } from './IFadeableElement';

export interface IAudio extends IHasAudio, IPlayableElement, IFadeableElement {}
