import { PureComponent } from 'react';
import { DefaultTheme, ThemeProps, withTheme } from 'styled-components';
import { SECONDARY_FONT, SMALL_FONT_SIZE } from '../../constants';
import { DarkTheme } from '../../themes/dark.theme';
import { convertToRef } from '../../utils';
import { TimelinableProps } from './Types/TimelinableProps';
import { ITimelinableComponent } from './Types/TimelinableComponent';

interface TimelineRulerProps extends TimelinableProps, ThemeProps<DefaultTheme> {
  /**
   * Ruler's height
   * @default 15
   */
  height?: number;

  /**
   * Main scale unit
   * @default 100
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
  longLineSize?: number,

  /**
   * Size of the short ruler lines.
   * @default 10
   */
  shortLineSize?: number,

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

export class BaseRuler extends PureComponent<TimelineRulerProps> implements ITimelinableComponent {
  public static defaultProps: TimelineRulerProps = {
    height: 15,
    zoom: 1,
    unit: 100,
    segments: 2,
    longLineSize: 15,
    shortLineSize: 10,
    textOffsetX: 5,
    textOffsetY: 3,
    theme: DarkTheme,
  };

  state = {
    scrollPos: 0,
  };

  declare canvasElement: HTMLCanvasElement;
  declare private canvasContext: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private zoom = 0;

  render() {
    this.zoom = this.props.zoom as number;

    return (
      <canvas
        ref={convertToRef(this, 'canvasElement')}
        height={this.height}
      />
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.resize();
    });
  }

  componentDidMount() {
    const canvas = this.canvasElement;
    const context = canvas.getContext('2d');

    this.canvasContext = context as CanvasRenderingContext2D;

    window.addEventListener('resize', () => {
      this.resize();
    });

    this.resize();
  }

  componentDidUpdate() {
    this.resize();
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

    this.width = canvas.offsetWidth;
    this.height = height;

    canvas.width = this.width;
    canvas.height = this.height;

    this.draw(scrollPos, nextZoom);
  }

  private draw(scrollPos: number = this.state.scrollPos, nextZoom = this.zoom) {
    this.zoom = nextZoom;

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
      textOffsetX,
      textOffsetY,
      textFormat,
    } = props;

    // Clear existing paths & text
    context.clearRect(0, 0, width, height);

    context.save();
    context.strokeStyle = theme.text.darker;
    context.fillStyle = theme.text.darker;
    context.lineWidth = 2;
    context.font = `${SMALL_FONT_SIZE}px ${SECONDARY_FONT}`;
    context.textBaseline = 'top';

    context.translate(0.5, 0);
    context.beginPath();

    const size = width;
    const zoomUnit = nextZoom * unit;
    const minRange = Math.floor(scrollPos * nextZoom / zoomUnit);
    const maxRange = Math.ceil((scrollPos * nextZoom + size) / zoomUnit);
    const length = maxRange - minRange;

    // Draw line at the top.
    context.moveTo(0, 0);
    context.lineTo(this.width, 0);

    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * unit;
      const startPos = (startValue - scrollPos) * nextZoom;

      for (let j = 0; j < segments; ++j) {
        const pos = startPos + j / segments * zoomUnit;

        if (pos < 0 || pos >= size) continue;

        const lineSize = j % 2 === 0 ? longLineSize : shortLineSize;
        const origin = 0;

        const [x1, y1] = [pos, origin];
        const [x2, y2] = [x1, y1 + lineSize];

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
      }
    }

    context.stroke();

    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * unit;
      const startPos = (startValue - scrollPos) * nextZoom;

      if (startPos < -zoomUnit || startPos >= size + unit * nextZoom) {
        continue;
      }

      const text = textFormat ? textFormat(startValue) : `${startValue}`;

      context.fillText(text, startPos + textOffsetX, textOffsetY);
    }

    context.restore();
  }
}

export const TimelineRuler = withTheme(BaseRuler);