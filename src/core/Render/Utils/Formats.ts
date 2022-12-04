import { FileFormat } from '../Enums/FileFormat';
import { FileType } from '../Enums/FileType';

export function getFileType(input: string): FileType {
  const fileFormat = getFileFormat(input);

  if (fileFormat === FileFormat.Video) {
    return FileType.Video;
  }

  if (fileFormat === FileFormat.Audio) {
    return FileType.Audio;
  }
}

export function getFileFormat(input: string): FileFormat {
  if (input.includes('mp4')) return FileFormat.Video;
  if (input.includes('wav')) return FileFormat.Audio;
}
