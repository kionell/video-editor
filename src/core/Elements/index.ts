import { AudioElement } from './AudioElement';
import { BaseElement } from './BaseElement';
import { ImageElement } from './ImageElement';
import { TextElement } from './TextElement';
import { VideoElement } from './VideoElement';
import { VisibleElement } from './VisibleElement';

export type MediaElement = VideoElement | AudioElement | ImageElement;
export type AnyElement = MediaElement | TextElement;

export {
  AudioElement,
  BaseElement,
  ImageElement,
  TextElement,
  VideoElement,
  VisibleElement,
};
