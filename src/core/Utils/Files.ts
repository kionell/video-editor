import { UploadedFile } from '../Files/UploadedFile';
import { ImageFile } from '../Files/ImageFile';
import { VideoFile } from '../Files/VideoFile';
import { AudioFile } from '../Files/AudioFile';
import { MIMEType } from '../Enums/MIMEType';
import { MediaType } from '../Enums/MediaType';
import { BaseElement } from '../Elements/BaseElement';
import { VideoElement } from '../Elements/VideoElement';
import { AudioElement } from '../Elements/AudioElement';
import { ImageElement } from '../Elements/ImageElement';
import { IFileState } from '../State/IFileState';

export async function loadFile(file: File): Promise<UploadedFile | null> {
  const mediaType = convertMIMEToMediaType(file.type as MIMEType);

  switch (mediaType) {
    case MediaType.Video:
      return new VideoFile(file).load();

    case MediaType.Audio:
      return new AudioFile(file).load();

    case MediaType.Image:
      return new ImageFile(file).load();
  }

  return null;
}

export function convertMIMEToMediaType(type: MIMEType): MediaType {
  switch (type) {
    case MIMEType.AVI1:
    case MIMEType.AVI2:
    case MIMEType.AVI3:
    case MIMEType.MP4:
    case MIMEType.WEBM:
    case MIMEType.MPEG:
      return MediaType.Video;

    case MIMEType.MP3:
    case MIMEType.OGG:
    case MIMEType.WAV:
    case MIMEType.WEBA:
      return MediaType.Audio;

    case MIMEType.BPM:
    case MIMEType.GIF:
    case MIMEType.ICO:
    case MIMEType.JPEG:
    case MIMEType.PNG:
    case MIMEType.SVG:
    case MIMEType.WEBP:
      return MediaType.Image;
  }
}

export function convertUploadedFileToElement(file: UploadedFile | null): BaseElement | null {
  if (!file) return null;

  const mediaType = convertMIMEToMediaType(file.type as MIMEType);

  switch (mediaType) {
    case MediaType.Video:
      return new VideoElement(file as VideoFile);

    case MediaType.Audio:
      return new AudioElement(file as AudioFile);

    case MediaType.Image:
      return new ImageElement(file as ImageFile);
  }

  return null;
}

export function getFileFromDraggable(draggable: HTMLElement, files: IFileState): UploadedFile | null {
  if (draggable.classList.contains('general-item')) {
    const parentElement = draggable.parentElement as HTMLElement;
    const labelElement = parentElement.querySelector<HTMLElement>('.general-item__label');

    if (!labelElement) return null;

    return files.list.find((f) => f.name === labelElement.innerText) ?? null;
  }

  return null;
}
