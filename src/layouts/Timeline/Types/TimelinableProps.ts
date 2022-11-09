export interface TimelinableProps {
  /**
   * Zoom of the current timelinable component.
   * @default 1
   */
   zoom?: number;

  /**
   * Current scroll position set by component props.
   * This overwrites scroll method values.
   * @default undefined
   */
  scrollPos?: number;
}
