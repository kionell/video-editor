export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function map(value: number, from1: number, to1: number, from2: number, to2: number): number {
  if (value < from1) return from2;
  if (value >= to1) return to2;

  return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}
