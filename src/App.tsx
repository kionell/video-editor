import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import { DarkTheme } from './themes/dark.theme';
import { BaseGlobalStyle } from './styles/BaseGlobalStyle';
import './styles/CustomFonts.css';
import { ffmpeg } from './lib/FFmpeg';
import { MainPage } from './pages/Main';
import { DebugPage } from './pages/Debug';

export function App() {
  const [theme, setTheme] = useState(DarkTheme);
  const [ready, setReady] = useState(false);

  const load = async () => {
    // if (!ffmpeg.isLoaded()) {
    //   await ffmpeg.load();
    // }

    setReady(true);
  };

  useEffect(() => {
    setTheme(DarkTheme);
    load();
  });

  return ready
    ?
    (
      <div style={{ width: '100%', height: '100%' }}>
        <BaseGlobalStyle />
        <Provider store={store}>
          <ThemeProvider theme={theme}>
              <MainPage />
              {/* <DebugPage /> */}
          </ThemeProvider>
        </Provider>
      </div>
    )
    :
    (
      <div>Loading...</div>
    );
}
