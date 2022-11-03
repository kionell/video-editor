import { UploadedFile } from '../models/Files/UploadedFile';
import { ImageFile } from '../models/Files/ImageFile';
import { VideoFile } from '../models/Files/VideoFile';
import { AudioFile } from '../models/Files/AudioFile';
import { MIMEType } from '../models/Enums/MIMEType';
import { MediaType } from '../models/Enums/MediaType';
import { BaseElement } from '../models/Elements/BaseElement';
import { VideoElement } from '../models/Elements/VideoElement';
import { AudioElement } from '../models/Elements/AudioElement';
import { ImageElement } from '../models/Elements/ImageElement';

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

export function convertUploadedFileToElement(file: UploadedFile): BaseElement | null {
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