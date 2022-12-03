import { IBaseElement } from './IBaseElement';
import { IFadeableElement } from './IFadeableElement';
import { IHasAudio } from './IHasAudio';
import { IHasColorAdjustments } from './IHasColorAdjustments';
import { IHasFilters } from './IHasFilters';
import { IHasTextSettings } from './IHasTextSettings';
import { IPlayableElement } from './IPlayableElement';
import { ITransformableElement } from './ITransformableElement';

/**
 * Used for elements that have every type of settings.
 */
export interface IHasEverything extends
  IBaseElement,
  IFadeableElement,
  IHasAudio,
  IHasColorAdjustments,
  IHasFilters,
  IPlayableElement,
  ITransformableElement,
  IHasTextSettings
  {}
