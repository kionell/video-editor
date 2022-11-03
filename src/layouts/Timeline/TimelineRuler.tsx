import { PureComponent } from 'react';
import { DefaultTheme, ThemeProps, withTheme } from 'styled-components';
import { SECONDARY_FONT, SMALL_FONT_SIZE } from '../../constants';
import { DarkTheme } from '../../themes/dark.theme';
import { convertToRef } from '../../utils/react';
import { TimelinableProps } from './Types/TimelinableProps';
import { ITimelinableComponent } from './Types/TimelinableComponent';
import { formatTime } from '../../utils/format';

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
   * Size of the ruler lines.
   * @default 15
   */
  lineSize?: number,

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
    height: 15,
    zoom: 1,
    unit: 100,
    lineSize: 15,
    textOffsetX: 5,
    textOffsetY: 3,
    theme: DarkTheme,
    textFormat: formatTime,
  };

  state = {
    scrollPos: 0,
  };

  declare canvasElement: HTMLCanvasElement;
  declare private canvasContext: CanvasRenderingContext2D | null;
  private width = 0;
  private height = 0;
  private zoom = 1;

  private readonly zoomScale = 1;
  private readonly minUnitDistance = 100;

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

    this.width = window.innerWidth;
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
      unit,
      lineSize,
      textOffsetX,
      textOffsetY,
      textFormat,
    } = props;

    nextZoom *= this.zoomScale;
    scrollPos /= this.zoomScale;

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

    // Draw lines.
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * unit;
      const startPos = (startValue - scrollPos) * nextZoom;

      if (startPos < 0 || startPos >= size) continue;

      context.moveTo(startPos, 0);
      context.lineTo(startPos, lineSize);
    }

    context.stroke();

    // Draw text.
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * zoomUnit;
      const startPos = (startValue - scrollPos) * nextZoom;

      if (startPos < -zoomUnit || startPos >= size + unit * nextZoom) {
        continue;
      }

      const text = textFormat ? textFormat(startValue) : `${startValue}`;

      context.fillText(text, startPos + textOffsetX, textOffsetY);
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
