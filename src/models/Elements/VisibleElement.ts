import { Filter } from '../Enums/Filter';
import { BaseElement } from './BaseElement';
import { Bounds } from './Bounds';
import { IFadeableElement } from './Types/IFadeableElement';
import { IHasColorAdjustments } from './Types/IHasColorAdjustments';
import { IHasFilters } from './Types/IHasFilters';
import { ITransformableElement } from './Types/ITransformableElement';

/**
 * A visible element that can be placed on a timeline track.
 */
export abstract class VisibleElement extends BaseElement implements 
  ITransformableElement, IFadeableElement, IHasFilters, IHasColorAdjustments {

  fadeInTimeMs = 0;
  fadeOutTimeMs = 0;

  bounds = new Bounds();
  rotation = 0;
  scale = 1;
  zoom = 1;
  flipX = false;
  flipY = false;

  exposure = 0.5;
  saturation = 0.5;
  temperature = 0.5;
  constrast = 1;
  opacity = 1;
  blur = 0;

  filters: Filter[] = [];
}
