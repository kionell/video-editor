import { PureComponent } from 'react';
import { DefaultTheme, ThemeProps, withTheme } from 'styled-components';
import { PREVIEW_FRAME_WIDTH, SECONDARY_FONT, SMALL_FONT_SIZE } from '../../constants';
import { DarkTheme } from '../../themes/dark.theme';
import { convertToRef } from '../../utils/react';
import { TimelinableProps } from './Types/TimelinableProps';
import { ITimelinableComponent } from './Types/TimelinableComponent';
import { formatTimelineUnit } from '../../utils/format';

interface TimelineRulerProps extends TimelinableProps, ThemeProps<DefaultTheme> {
  /**
   * Ruler's height
   * @default 15
   */
  height?: number;

  /**
   * Main scale unit
   * @default 1
   * @example
   * ```
   * 1px (Default) zoom: 1, unit: 50 (every 50px)
   * ```
   */
  unit?: number;

  /**
   * Number of areas to divide between two main lines
   * @default 2
   */
  segments?: number;

  /**
   * Size of the long ruler lines.
   * @default 15
   */
  longLineSize?: number;

  /**
   * Size of the short ruler lines.
   * @default 10
   */
  shortLineSize?: number;

  /**
   * Starting offset by X-axis.
   */
  offsetX?: number;

  /**
   * Text offset by X-axis.
   * @default 5
   */
  textOffsetX?: number;

  /**
   * Text offset by Y-axis.
   * @default 3
   */
  textOffsetY?: number;

  /**
   * Function for custom text format.
   * @default undefined
   */
  textFormat?: (scale: number) => string;
}

class BaseRuler extends PureComponent<TimelineRulerProps> implements ITimelinableComponent {
  static defaultProps: TimelineRulerProps = {
    height: 40,
    zoom: 1,
    unit: 1,
    segments: 1,
    longLineSize: 14,
    shortLineSize: 8,
    offsetX: 40,
    textOffsetX: -32,
    textOffsetY: 20,
    theme: DarkTheme,
    textFormat: formatTimelineUnit,
  };

  state = {
    scrollPos: 0,
  };

  declare canvasElement: HTMLCanvasElement;
  declare private canvasContext: CanvasRenderingContext2D | null;
  private width = 0;
  private height = 0;
  private zoom = 1;

  render() {
    this.zoom = this.props.zoom as number;

    return (
      <canvas
        ref={convertToRef(this, 'canvasElement')}
        height={this.height}
      />
    );
  }

  scroll(scrollPos: number, nextZoom?: number) {
    this.draw(scrollPos, nextZoom);
  }

  resize(nextZoom?: number) {
    const canvas = this.canvasElement;
    const {
      height,
      scrollPos,
    } = this.props as Required<TimelineRulerProps>;

    const offsetParent = canvas.offsetParent as HTMLDivElement;

    this.width = offsetParent?.offsetWidth ?? canvas.offsetWidth;
    this.height = height;

    canvas.width = this.width;
    canvas.height = this.height;

    this.draw(scrollPos, nextZoom);
  }

  private draw(scrollPos: number = this.state.scrollPos, nextZoom = this.zoom) {
    this.zoom = nextZoom;

    if (!this.canvasContext) return;

    const props = this.props as Required<TimelineRulerProps>;
    const width = this.width;
    const height = this.height;
    const context = this.canvasContext;
    const state = this.state;

    state.scrollPos = scrollPos;

    const {
      theme,
      segments,
      unit,
      longLineSize,
      shortLineSize,
      offsetX,
      textOffsetX,
      textOffsetY,
      textFormat,
    } = props;

    // Clear existing paths & text
    context.clearRect(0, 0, width, height);

    context.save();
    context.strokeStyle = theme.text.darker;
    context.fillStyle = theme.text.normal;
    context.lineWidth = 1;
    context.font = `${SMALL_FONT_SIZE}px ${SECONDARY_FONT}`;
    context.textBaseline = 'top';

    context.translate(0.5, 0);
    context.beginPath();

    // Represents distance between two long lines with current zoom level.
    const zoomUnit = unit * nextZoom * PREVIEW_FRAME_WIDTH;

    const size = width;
    const minRange = Math.floor(scrollPos / zoomUnit);
    const maxRange = Math.ceil((scrollPos + size) / zoomUnit);
    const length = maxRange - minRange;

    // Draw line at the top.
    context.moveTo(0, 0);
    context.lineTo(this.width, 0);

    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * zoomUnit;
      const startPos = (startValue - scrollPos) + offsetX;

      for (let j = 0; j < segments; ++j) {
        const pos = startPos + j / segments * zoomUnit;

        if (pos < 0 || pos >= size) continue;

        const lineSize = j % segments ? shortLineSize : longLineSize;
        const origin = 0;

        const [x1, y1] = [pos, origin];
        const [x2, y2] = [x1, y1 + lineSize];

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
      }
    }

    context.stroke();

    // Draw text.
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * zoomUnit / nextZoom;
      const startPos = (startValue - scrollPos / nextZoom) * nextZoom;

      if (startPos < -zoomUnit || startPos >= size + zoomUnit) continue;

      const text = textFormat ? textFormat(startValue) : `${startValue}`;

      context.fillText(text, startPos + textOffsetX + offsetX, textOffsetY);
    }

    context.restore();
  }

  private onResize = () => this.resize();

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    this.canvasContext = this.canvasElement.getContext('2d');

    window.addEventListener('resize', this.onResize);

    this.resize();
  }

  componentDidUpdate() {
    this.resize();
  }
}

export const TimelineRuler = withTheme(BaseRuler);
