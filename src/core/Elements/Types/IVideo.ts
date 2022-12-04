import { IHasAudio } from './IHasAudio';
import { IPlayableElement } from './IPlayableElement';
import { IVisible } from './IVisible';

export interface IVideo extends IVisible, IHasAudio, IPlayableElement {}
