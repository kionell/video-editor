import { useEffect, useState } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { DarkTheme } from './themes/dark.theme';
import { Main } from './pages/Main';
import { CustomFonts } from './fonts';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #1E1E1E;
  }
`;

export function App() {
  const [theme, setTheme] = useState(DarkTheme);

  useEffect(() => setTheme(DarkTheme));

  return (
    <>
      <GlobalStyle />
      <CustomFonts />
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </>
  );
}