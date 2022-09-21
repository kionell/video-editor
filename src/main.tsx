import React from 'react';
import ReactDOM from 'react-dom/client';

import Main from './pages/Main';

const element = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(element);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
