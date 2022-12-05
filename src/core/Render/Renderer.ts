import { createFFmpeg, FFmpeg, fetchFile, LogCallback } from '@ffmpeg/ffmpeg';
import {
  DEFAULT_VIDEO_WIDTH,
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_FRAMERATE,
  DEFAULT_VIDEO_MIN_BITRATE,
  DEFAULT_VIDEO_MAX_BITRATE,
  DEFAULT_AUDIO_SAMPLE_RATE,
  DEFAULT_AUDIO_BITRATE,
} from '../../constants';
import { MediaElement } from '../Elements';
import { UploadedFile } from '../Files/UploadedFile';
import { TimelineTrack } from '../Timeline/TimelineTrack';
import { BitrateEncoding } from './Enums/BitrateEncoding';
import { IOutputSettings, RequiredSettings } from './Interfaces/IOutputSettings';
import { FilterFlagGenerator } from './Filters/FilterFlagGenerator';
import { FileFormat } from './Enums/FileFormat';
import { FileType } from './Enums/FileType';

export class Renderer {
  private _ffmpeg: FFmpeg;
  private _files: UploadedFile[];
  private _tracks: TimelineTrack[];
  private _outputSettings: RequiredSettings;
  private _customLogger: LogCallback;

  constructor(settings?: IOutputSettings) {
    this._ffmpeg = createFFmpeg({ log: true });

    const outputFormat = settings?.outputFormat || FileFormat.Video;

    let fileName = settings?.fileName || 'Untitled';

    if (!fileName.endsWith(outputFormat)) {
      fileName += outputFormat;
    }

    this._outputSettings = {
      includeVideo: settings?.includeVideo ?? true,
      width: settings?.width || DEFAULT_VIDEO_WIDTH,
      height: settings?.height || DEFAULT_VIDEO_HEIGHT,
      forceAspectRatio: settings?.forceAspectRatio ?? false,
      frameRate: settings?.frameRate || DEFAULT_FRAMERATE,
      bitrateEncoding: settings?.bitrateEncoding ?? BitrateEncoding.VBR,
      bitrateMin: settings?.bitrateMin || DEFAULT_VIDEO_MIN_BITRATE,
      bitrateMax: settings?.bitrateMax || DEFAULT_VIDEO_MAX_BITRATE,
      twoPass: settings?.twoPass ?? false,
      includeAudio: settings?.includeAudio ?? true,
      sampleRate: settings?.sampleRate || DEFAULT_AUDIO_SAMPLE_RATE,
      audioBitrate: settings?.audioBitrate || DEFAULT_AUDIO_BITRATE,
      fileType: settings?.fileType ?? FileType.Video,
      outputFormat,
      fileName,
    };
  }

  setLogger(log: LogCallback): void {
    this._customLogger = log;
    this._ffmpeg.setLogger(log);
  }

  async load(): Promise<void> {
    if (this._ffmpeg.isLoaded()) return;

    return this._ffmpeg.load();
  }

  async render(tracks: TimelineTrack[]): Promise<void> {
    this._files = this._getUniqueFiles(tracks);
    this._tracks = tracks;

    if (!this._files.length) return;

    await this._loadFiles();

    await this._ffmpeg.run(...this._generateCommand());

    const buffer = this._ffmpeg.FS('readFile', this._outputSettings.fileName);

    const link = document.createElement('a');

    link.type = 'download';
    link.href = URL.createObjectURL(new Blob([buffer]));
    link.download = this._outputSettings.fileName;
    link.click();
  }

  finish(): void {
    this._files.forEach((file) => {
      this._ffmpeg.FS('unlink', file.name);
    });

    this._ffmpeg.exit();
  }

  async _loadFiles(): Promise<void> {
    const promises = this._files.map(async (file) => {
      const fetched = await fetchFile(file.url);

      this._ffmpeg.FS('writeFile', file.name, fetched);
    });

    await Promise.all(promises);
  }

  _generateCommand(): string[] {
    const command: string[][] = [];

    command.push(this._getInputSettings());
    command.push(this._getOtherSettings());
    command.push(this._getOutputSettings());

    return command.flat();
  }

  _getUniqueFiles(tracks: TimelineTrack[]): UploadedFile[] {
    const uniqueFiles = new Set<UploadedFile>();

    tracks.forEach((track) => {
      track.elements.forEach((element) => {
        const fileElement = element as MediaElement;

        if (!fileElement.file || uniqueFiles.has(fileElement.file)) {
          return;
        }

        uniqueFiles.add(fileElement.file);
      });
    });

    return [...uniqueFiles];
  }

  _getInputSettings(): string[] {
    return ['-y', ...this._files.flatMap((file) => ['-i', file.name])];
  }

  _getOtherSettings(): string[] {
    const filterGenerator = new FilterFlagGenerator(
      this._tracks,
      this._files,
      this._outputSettings,
    );

    const filters = filterGenerator.generate();

    if (filters.length) {
      filters.push('-map');
      filters.push('[track0_v]');
      // filters.push('-map');
      // filters.push('[track0_a]');
    }

    return filters;
  }

  _getOutputSettings(): string[] {
    /**
     * Currently libx264 is the most "stable" codec.
     */
    const outputSettings: string[][] = [];

    outputSettings.push(['-c:v', 'libx264']);
    outputSettings.push(['-preset', 'ultrafast']);

    if (!this._outputSettings.includeVideo) {
      outputSettings.push(['-vn']);
    }

    if (!this._outputSettings.includeAudio) {
      outputSettings.push(['-an']);
    }

    outputSettings.push([this._outputSettings.fileName]);

    return outputSettings.flat();
  }
}
