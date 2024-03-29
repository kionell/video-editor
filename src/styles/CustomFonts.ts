const fontStyle = document.createElement('style');

fontStyle.textContent = `
  @font-face {
    font-family: 'Roboto';
    src: url('src/assets/fonts/Roboto-Regular.ttf') format('truetype');
    font-style: normal;
    font-display: auto;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/src/assets/fonts/Roboto-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: auto;
  }
`;

document.head.appendChild(fontStyle);

export {};
