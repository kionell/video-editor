import etro from 'etro';

import {
  VideoElement,
  AudioElement,
  ImageElement,
  TextElement,
  BaseElement,
} from './Elements';

import { Timeline } from './Timeline/Timeline';
import { MediaType } from './Enums/MediaType';

/**
 * A wrapper around etro movie instance that works with timeline elements.
 */
export class VideoPlayer {
  private _movie: etro.Movie;

  constructor(options: etro.MovieOptions) {
    this._movie = new etro.Movie(options);
  }

  play(): void {
    this._movie.play();
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

  syncWithTimeline(timeline: Timeline) {
    const isPlaying = !this._movie.paused;

    if (isPlaying) this._movie.pause();

    const currentTime = this._movie.currentTime;

    const newLayers = timeline.tracks.flatMap((track) => {
      return track.elements.map((e) => this._getLayerFromElement(e));
    });

    // First track should be at the top.
    newLayers.reverse();

    this._movie.layers.length = 0;

    newLayers.forEach((layer) => {
      if (layer) this._movie.addLayer(layer);
    });

    this._movie.currentTime = currentTime;
    this._movie.refresh();

    if (isPlaying) this._movie.play();
  }

  private _getLayerFromElement(element: BaseElement): etro.layer.Base | null {
    const found = this._findExistingMediaLayer(element);

    if (found) {
      found.startTime = element.startTimeMs / 1000;
      found.duration = element.durationMs / 1000;

      return found;
    }

    return this._convertElement(element);
  }

  private _convertElement(element: BaseElement): etro.layer.Base | null {
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
      startTime: element.startTimeMs / 1000,
      duration: element.durationMs / 1000,
      opacity: element.opacity,
      sourceStartTime: element.startTrimMs,
      source: element.file.source,
      muted: element.file.source.muted,
      volume: element.file.source.volume,
      playbackRate: element.file.source.playbackRate,
      destWidth: this._movie.canvas.width,
      destHeight: this._movie.canvas.height,
    });

    return layer;
  }

  private _convertAudioElement(element: AudioElement): etro.layer.Audio {
    const layer = new etro.layer.Audio({
      startTime: element.startTimeMs / 1000,
      duration: element.durationMs / 1000,
      sourceStartTime: element.startTrimMs,
      source: element.file.source,
      muted: element.file.source.muted,
      volume: element.file.source.volume,
      playbackRate: element.file.source.playbackRate,
    });

    return layer;
  }

  private _convertImageElement(element: ImageElement): etro.layer.Image {
    const layer = new etro.layer.Image({
      startTime: element.startTimeMs / 1000,
      duration: element.durationMs / 1000,
      source: element.file.source,
      destWidth: this._movie.canvas.width,
      destHeight: this._movie.canvas.height,
    });

    return layer;
  }

  private _convertTextElement(element: TextElement): etro.layer.Text {
    const layer = new etro.layer.Text({
      startTime: element.startTimeMs / 1000,
      duration: element.durationMs / 1000,
      text: element.text,
      font: element.font,
      opacity: element.opacity,
      color: etro.parseColor(element.color),
      textAlign: element.align,
    });

    return layer;
  }

  private _findExistingMediaLayer(element: BaseElement): etro.layer.Base | null {
    const mediaElement = element as VideoElement | AudioElement | ImageElement;

    if (!mediaElement.file) return null;

    const found = this._movie.layers.find((layer) => {
      if (layer instanceof etro.layer.Video) {
        return layer.source === mediaElement.file.source;
      }

      if (layer instanceof etro.layer.Audio) {
        return layer.source === mediaElement.file.source;
      }

      if (layer instanceof etro.layer.Image) {
        return layer.source === mediaElement.file.source;
      }

      return false;
    });

    return found ?? null;
  }
}
