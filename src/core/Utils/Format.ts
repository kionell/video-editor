import { FRAME_INTERVAL, PREVIEW_FRAME_WIDTH } from '../../constants';

/**
 * Converts raw time value to the readable format.
 * @param time Target time in seconds.
 * @returns Time in format H:MM:SS.
 */
 export function formatDuration(time?: number): string {
  if (!time) return '0:00';

  time = Math.round(time);

  const seconds = Math.trunc(time) % 60;
  const minutes = Math.trunc(time / 60) % 60;
  const hours = Math.trunc(time / 3600);

  const values = [
    minutes.toString(),
    seconds.toString().padStart(2, '0'),
  ];

  if (hours > 0) {
    values.unshift(hours.toString());
    values[1] = values[1].padStart(2, '0');
  }

  return values.join(':');
}

/**
 * Converts current timeline time to the readable format.
 * @param timeMs Target time in milliseconds.
 * @returns Time in format HH:MM:SS.FPS
 */
export function formatTimeMs(timeMs?: number) {
  if (!timeMs) return '00:00:00.00';

  const milliseconds = Math.trunc(timeMs) % 1000;
  const seconds = Math.trunc(timeMs / 1000) % 60;
  const minutes = Math.trunc(timeMs / 60000) % 60;
  const hours = Math.trunc(timeMs / 3600000);

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  const frames = Math.floor(milliseconds / FRAME_INTERVAL);
  const formattedFrames = `${frames}`.padStart(2, '0');

  return `${formattedTime}.${formattedFrames}`;
}

/**
 * Converts raw timeline units to the readable format.
 * @param units Target unit value.
 * @returns Time in format HH:MM:SS.FPS
 */
export function formatTimelineUnit(units?: number): string {
  if (!units) return '00:00:00.00';

  const time = units / PREVIEW_FRAME_WIDTH;

  const frames = Math.trunc(time) % 60;
  const seconds = Math.trunc(time / 60) % 60;
  const minutes = Math.trunc(time / 3600) % 60;
  const hours = Math.trunc(time / 216000);

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  const formattedFrames = `${frames}`.padStart(2, '0');

  return `${formattedTime}.${formattedFrames}`;
}

export function formatTimestamp(timeMs?: number): string {
  const formatted = formatTimeMs(timeMs);

  const [time, fps] = formatted.split('.');

  const framerate = Number(fps);

  const milliseconds = Math.round(framerate * FRAME_INTERVAL);

  return `${time}.${milliseconds}`;
}
