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

  html, body, #root {
    height: 100%;
  }

  body {
    background: #1E1E1E;
  }
`;

export function App() {
  const [theme, setTheme] = useState(DarkTheme);

  useEffect(() => setTheme(DarkTheme));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GlobalStyle />
      <CustomFonts />
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </div>
  );
}