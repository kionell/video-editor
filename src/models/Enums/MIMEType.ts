/**
 * Supported MIME types.
 */
export enum MIMEType {
  AVI1 = 'video/avi',
  AVI2 = 'video/msvideo',
  AVI3 = 'video/x-msvideo',
  BPM = 'image/bmp',
  GIF = 'image/gif',
  ICO = 'image/vnd.microsoft.icon',
  JPEG = 'image/jpeg',
  MP3 = 'audio/mpeg',
  MP4 = 'video/mp4',
  MPEG = 'video/mpeg',
  OGG = 'audio/ogg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  WAV = 'audio/wav',
  WEBA = 'audio/webm',
  WEBM = 'video/webm',
  WEBP = 'image/webp',
}

export type VideoType = MIMEType.AVI1 
  | MIMEType.AVI2 
  | MIMEType.AVI3 
  | MIMEType.MP4 
  | MIMEType.MPEG 
  | MIMEType.WEBM;

export type AudioType = MIMEType.MP3 
  | MIMEType.OGG 
  | MIMEType.WAV 
  | MIMEType.WEBA;

export type ImageType = MIMEType.BPM 
  | MIMEType.GIF 
  | MIMEType.ICO 
  | MIMEType.JPEG 
  | MIMEType.PNG 
  | MIMEType.WEBP;
