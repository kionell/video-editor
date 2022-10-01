import { createGlobalStyle } from 'styled-components';

export const BaseGlobalStyle = createGlobalStyle`
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
