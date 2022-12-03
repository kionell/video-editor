import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { MediaElement } from '../Elements';

import { UploadedFile } from '../Files/UploadedFile';
import { TimelineTrack } from '../Timeline/TimelineTrack';
import { IOutputSettings, RequiredSettings } from './Interfaces/IOutputSettings';
import { getFilterComplex } from './Utils/Filters';

export class Renderer {
  private _ffmpeg: FFmpeg;
  private _files: UploadedFile[];
  private _tracks: TimelineTrack[];
  private _outputSettings: RequiredSettings;

  constructor(settings?: IOutputSettings) {
    this._ffmpeg = createFFmpeg({ log: true });

    let outputName = settings?.fileName ?? 'Untitled';

    if (!outputName.endsWith('.mp4')) {
      outputName += '.mp4';
    }

    this._outputSettings = {
      fileName: outputName,
      width: settings?.width || 1920,
      height: settings?.height || 1080,
      frameRate: settings?.frameRate || 60,
    };
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

    const buffer = this._ffmpeg.FS('readFile', 'Untitled.mp4');

    const link = document.createElement('a');

    link.type = 'download';
    link.href = URL.createObjectURL(new Blob([buffer]));
    link.download = 'Untitled.mp4';
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

    command.push(this._getFileInputs());
    command.push(getFilterComplex(this._tracks, this._files));
    command.push(this._getOutputFormat());
    command.push(this._getFileOutput());

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

  _getFileInputs(): string[] {
    const inputs = this._files.flatMap((file) => ['-i', file.name]);

    const blankWidth = this._outputSettings.width;
    const blankHeight = this._outputSettings.height;

    /**
     * Reserved input for blank space.
     */
    inputs.push('-f');
    inputs.push('lavfi');
    inputs.push('-t');
    inputs.push('5');
    inputs.push('-i');
    inputs.push(`color=c=black:s=${blankWidth}x${blankHeight}`);

    return inputs;
  }

  _getFileOutput(): string[] {
    return [this._outputSettings.fileName];
  }

  _getOutputFormat(): string[] {
    /**
     * Currently libx264 is the only available codec.
     */
    return ['-c:v', 'libx264', '-preset', 'ultrafast'];
  }
}
