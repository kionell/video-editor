import { AudioElement } from './AudioElement';
import { BaseElement } from './BaseElement';
import { ImageElement } from './ImageElement';
import { TextElement } from './TextElement';
import { VideoElement } from './VideoElement';

export type MediaElement = VideoElement | AudioElement | ImageElement;
export type AnyElement = MediaElement | TextElement;

export {
  AudioElement,
  BaseElement,
  ImageElement,
  TextElement,
  VideoElement,
};
