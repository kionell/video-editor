interface INormalColors {
  accent: string;
  hover: string;
  press: string;
  surface: string;
}

interface ITextColors {
  normal: string;
  lighter: string;
  darker: string;
}

export interface ITheme {
  primary: INormalColors;
  secondary: INormalColors;
  text: ITextColors;
  danger: string;
  background: string;
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ITheme {}
}
