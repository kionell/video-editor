interface INormalColors {
  normal: string;
  normalHover: string;
}

interface IAccentColors {
  accent: string;
  accentHover: string;
}

type IPrimaryColors = INormalColors & IAccentColors;
type ISecondaryColors = INormalColors & IAccentColors;
type IInputColors = INormalColors;

interface IScrollbarColors {
  thumb: string;
  track: string;
}

interface ITextColors {
  normal: string;
  lighter: string;
  darker: string;
}

interface IContainerColors {
  primary: string;
  secondary: string;
  background: string;
}

export interface ITheme {
  primary: IPrimaryColors;
  secondary: ISecondaryColors;
  scrollbar: IScrollbarColors;
  input: IInputColors;
  text: ITextColors;
  container: IContainerColors;
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ITheme {}
}
