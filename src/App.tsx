import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { DarkTheme } from './themes/dark.theme';
import { Main } from './pages/Main';

export function App() {
  const [theme, setTheme] = useState(DarkTheme);

  useEffect(() => setTheme(DarkTheme));

  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}