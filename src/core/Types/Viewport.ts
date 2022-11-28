/**
 * Viewport of an visual element.
 */
 export class Viewport {
  /**
   * X-position of the target.
   */
  dx: number;

  /**
   * Y-position of the target.
   */
	dy: number;

  /**
   * Width of the target.
   */
	dw: number;

  /**
   * Height of the target.
   */
	dh: number;

  /**
   * X-position of the source.
   */
  sx: number;

  /**
   * Y-position of the source.
   */
  sy: number;

  /**
   * Width of the source.
   */
  sw: number;

  /**
   * Height of the source.
   */
  sh: number;

  constructor(options?: Partial<Viewport>) {
    this.dx = options?.dx ?? 0;
    this.dy = options?.dy ?? 0;
    this.dw = options?.dw ?? 0;
    this.dh = options?.dh ?? 0;
    this.sx = options?.sx ?? 0;
    this.sy = options?.sy ?? 0;
    this.sw = options?.sw ?? 0;
    this.sh = options?.sh ?? 0;
  }
}
