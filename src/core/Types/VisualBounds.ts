/**
 * Visual bounds of an element.
 */
export class VisualBounds {
  /**
   * Current X position of the element.
   */
  x: number;

  /**
   * Current Y position of the element.
   */
	y: number;

  /**
   * Current width of the element.
   */
	width: number;

  /**
   * Current height of the element.
   */
	height: number;

  /**
   * Current left offset of the element.
   */
	left: number;

  /**
   * Current right offset of the element.
   */
	right: number;

  /**
   * Current top offset of the element.
   */
	top: number;

  /**
   * Current bottom offset of the element.
   */
	bottom: number;

  constructor(options?: Partial<VisualBounds>) {
    this.x = options?.x ?? 0;
    this.y = options?.y ?? 0;
    this.width = options?.width ?? 0;
    this.height = options?.height ?? 0;
    this.left = options?.left ?? 0;
    this.right = options?.right ?? 0;
    this.top = options?.top ?? 0;
    this.bottom = options?.bottom ?? 0;
  }

  get isChanged(): boolean {
    return this.left !== 0
      || this.top !== 0
      || this.right !== 0
      || this.bottom !== 0;
  }
}
