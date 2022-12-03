import { Filter } from '../Enums/Filter';
import { BaseElement } from './BaseElement';
import { IFadeableElement } from './Types/IFadeableElement';
import { IHasColorAdjustments } from './Types/IHasColorAdjustments';
import { IHasFilters } from './Types/IHasFilters';
import { ITransformableElement } from './Types/ITransformableElement';
import {
  DEFAULT_BLUR,
  DEFAULT_CONTRAST,
  DEFAULT_EXPOSURE,
  DEFAULT_FADE_IN,
  DEFAULT_FADE_OUT,
  DEFAULT_FLIP_X,
  DEFAULT_FLIP_Y,
  DEFAULT_OPACITY,
  DEFAULT_ROTATION,
  DEFAULT_SATURATION,
  DEFAULT_TEMPERATURE,
} from '../../constants';

/**
 * A visible element that can be placed on a timeline track.
 */
export abstract class VisibleElement extends BaseElement implements
  ITransformableElement, IFadeableElement, IHasFilters, IHasColorAdjustments {

  fadeInTimeMs = DEFAULT_FADE_IN;
  fadeOutTimeMs = DEFAULT_FADE_OUT;

  rotation = DEFAULT_ROTATION;
  flipX = DEFAULT_FLIP_X;
  flipY = DEFAULT_FLIP_Y;

  exposure = DEFAULT_EXPOSURE;
  saturation = DEFAULT_SATURATION;
  temperature = DEFAULT_TEMPERATURE;
  contrast = DEFAULT_CONTRAST;
  opacity = DEFAULT_OPACITY;
  blur = DEFAULT_BLUR;

  filters: Filter[] = [];

  get isChanged(): boolean {
    return super.isChanged
      || this.fadeInTimeMs !== DEFAULT_FADE_IN
      || this.fadeOutTimeMs !== DEFAULT_FADE_OUT
      || this.rotation !== DEFAULT_ROTATION
      || this.flipX !== DEFAULT_FLIP_X
      || this.flipY !== DEFAULT_FLIP_Y
      || this.exposure !== DEFAULT_EXPOSURE
      || this.saturation !== DEFAULT_SATURATION
      || this.temperature !== DEFAULT_TEMPERATURE
      || this.contrast !== DEFAULT_CONTRAST
      || this.opacity !== DEFAULT_OPACITY
      || this.blur !== DEFAULT_BLUR;
  }
}
