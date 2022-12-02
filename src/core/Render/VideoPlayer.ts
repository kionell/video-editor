import etro from 'etro';

import {
  VideoElement,
  AudioElement,
  ImageElement,
  TextElement,
  BaseElement,
} from '../Elements';

import { MediaType } from '../Enums/MediaType';
import { getViewport } from '../Utils/Render';
import { TimelineTrack } from '../Timeline/TimelineTrack';

/**
 * A wrapper around etro movie instance that works with timeline elements.
 */
export class VideoPlayer {
  private _movie: etro.Movie;

  private _elementToLayerMap: Map<BaseElement, etro.layer.Base> = new Map();

  constructor(options: etro.MovieOptions) {
    this._movie = new etro.Movie(options);
  }

  async play(): Promise<void> {
    return this._movie.play();
  }

  pause(): void {
    this._movie.pause();
  }

  stop(): void {
    this._movie.stop();
  }

  get paused(): boolean {
    return this._movie.paused;
  }

  get ended(): boolean {
    return this._movie.ended;
  }

  get currentTime(): number {
    return this._movie.currentTime;
  }

  set currentTime(value: number) {
    this._movie.currentTime = value;
  }

  /**
   * Raw movie instance.
   */
  get movie(): etro.Movie {
    return this._movie;
  }

  syncWithTimeline(tracks: TimelineTrack[]) {
    const elements = tracks.flatMap((t) => t.elements);

    this._removeOldMappings(elements);

    const newLayers = elements.map((e) => this._getLayerFromElement(e));

    // First track should be at the top.
    newLayers.reverse();

    if (this._areLayersUpdated(this._movie.layers, newLayers)) {
      this._movie.pause();

      const currentTime = this._movie.currentTime;

      if (this._movie.layers.length > 0) {
        this._movie.layers.length = 0;
      }

      newLayers.forEach((layer) => {
        if (layer) this._movie.addLayer(layer);
      });

      this.currentTime = currentTime;
    }
  }

  private _getLayerFromElement(element: BaseElement): etro.layer.Base | null {
    const found = this._findExistingMediaLayer(element);

    if (found) {
      found.startTime = element.startTimeMs / 1000;
      found.duration = element.durationMs / 1000;

      return found;
    }

    const layer = this._convertToLayer(element);

    this._elementToLayerMap.set(element, layer);

    const sourceLayer = layer as etro.layer.VisualSource;

    if (sourceLayer.source) {
      sourceLayer.source.addEventListener(
        'loadeddata',
        () => this._movie.refresh(),
        { once: true },
      );
    }

    return layer;
  }

  private _convertToLayer(element: BaseElement): etro.layer.Base | null {
    switch (element.type) {
      case MediaType.Video:
        return this._convertVideoElement(element as VideoElement);

      case MediaType.Audio:
        return this._convertAudioElement(element as AudioElement);

      case MediaType.Image:
        return this._convertImageElement(element as ImageElement);

      case MediaType.Text:
        return this._convertTextElement(element as TextElement);
    }

    return null;
  }

  private _convertVideoElement(element: VideoElement): etro.layer.Video {
    const layer = new etro.layer.Video({
      ...this._getBaseOptions(element),
      ...this._getVisualOptions(element),
      ...this._getAudioOptions(element),
      source: element.file.source.cloneNode(true) as HTMLVideoElement,
    });

    return layer;
  }

  private _convertAudioElement(element: AudioElement): etro.layer.Audio {
    const layer = new etro.layer.Audio({
      ...this._getBaseOptions(element),
      ...this._getAudioOptions(element),
      source: element.file.source.cloneNode(true) as HTMLAudioElement,
    });

    return layer;
  }

  private _convertImageElement(element: ImageElement): etro.layer.Image {
    const layer = new etro.layer.Image({
      ...this._getBaseOptions(element),
      ...this._getVisualOptions(element),
      source: element.file.source,
    });

    return layer;
  }

  private _convertTextElement(element: TextElement): etro.layer.Text {
    const layer = new etro.layer.Text({
      ...this._getBaseOptions(element),
      text: element.text,
      font: element.font,
      opacity: element.opacity,
      color: etro.parseColor(element.color),
      textAlign: element.align,
    });

    return layer;
  }

  private _getBaseOptions(element: BaseElement): etro.layer.BaseOptions {
    return {
      startTime: element.startTimeMs / 1000,
      duration: element.durationMs / 1000,
    };
  }

  private _getVisualOptions(element: VideoElement | ImageElement): etro.layer.VisualSourceOptions {
    const viewport = getViewport({
      file: element.file,
      width: this._movie.canvas.width,
      height: this._movie.canvas.height,
    });

    return {
      x: viewport.dx,
      y: viewport.dy,
      width: viewport.dw,
      height: viewport.dh,
      destWidth: viewport.dw,
      destHeight: viewport.dh,
    } as etro.layer.VisualSourceOptions;
  }

  private _getAudioOptions(element: VideoElement | AudioElement): etro.layer.AudioOptions {
    return {
      sourceStartTime: element.startTrimMs,
      muted: element.file.source.muted,
      volume: element.file.source.volume,
      playbackRate: element.file.source.playbackRate,
    } as etro.layer.AudioOptions;
  }

  private _findExistingMediaLayer(element: BaseElement): etro.layer.Base | null {
    if (this._elementToLayerMap.has(element)) {
      return this._elementToLayerMap.get(element) as etro.layer.Base;
    }

    return null;
  }

  private _removeOldMappings(elements: BaseElement[]): void {
    this._elementToLayerMap.forEach((_, key, map) => {
      if (elements.find((element) => element === key)) return;

      map.delete(key);
    });
  }

  private _areLayersUpdated(original: etro.layer.Base[], other: etro.layer.Base[]): boolean {
    if (original.length !== other.length) {
      return true;
    }

    return original.some((layer, i) => {
      const sameStartTime = layer.startTime === other[i].startTime;
      const sameDuration = layer.duration === other[i].duration;

      return !sameStartTime || !sameDuration;
    });
  }
}
