import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import { DarkTheme } from './themes/dark.theme';
import { BaseGlobalStyle } from './styles/BaseGlobalStyle';
import { ffmpeg } from './lib/FFmpeg';
import { MainPage } from './pages/Main';
import { DebugPage } from './pages/Debug';
import './styles/CustomFonts.ts';

export function App() {
  const [theme, setTheme] = useState(DarkTheme);

  useEffect(() => setTheme(DarkTheme), []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BaseGlobalStyle />
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MainPage />
          {/* <DebugPage /> */}
        </ThemeProvider>
      </Provider>
    </div>
  );
}
