export interface ITimelinableComponent {
  /**
   * Scroll to that location. It can be used when the scrollPos prop is not used.
   * @param scrollPos scroll position.
   */
  scroll(scrollPos: number): void;

  /**
   * Recalculate the style of the ruler.
   */
  resize(): void;
}
