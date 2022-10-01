import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { DarkTheme } from './themes/dark.theme';
import { Main } from './pages/Main';
import { BaseGlobalStyle } from './styles/BaseGlobalStyle';
import { CustomFonts } from './styles/CustomFonts';

export function App() {
  const [theme, setTheme] = useState(DarkTheme);

  useEffect(() => setTheme(DarkTheme));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BaseGlobalStyle />
      <CustomFonts />
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </div>
  );
}