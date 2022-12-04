import { IBaseElement } from './IBaseElement';
import { IFadeableElement } from './IFadeableElement';
import { IHasColorAdjustments } from './IHasColorAdjustments';
import { IHasFilters } from './IHasFilters';
import { ITransformableElement } from './ITransformableElement';

export interface IVisible extends
  IBaseElement,
  IFadeableElement,
  IHasColorAdjustments,
  IHasFilters,
  ITransformableElement {}
