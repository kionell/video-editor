import { IFadeableElement } from './IFadeableElement';
import { IHasColorAdjustments } from './IHasColorAdjustments';
import { IHasFilters } from './IHasFilters';
import { ITransformableElement } from './ITransformableElement';

export interface IVisible extends IFadeableElement, IHasColorAdjustments, IHasFilters, ITransformableElement {}
