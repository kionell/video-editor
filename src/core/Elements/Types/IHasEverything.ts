import { IPlayableElement } from './IPlayableElement';
import { IVisible } from './IVisible';
import { IHasAudio } from './IHasAudio';
import { IHasText } from './IHasText';

/**
 * Used for elements that have every type of settings.
 */
export interface IHasEverything extends IPlayableElement, IVisible, IHasAudio, IHasText {}
