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
