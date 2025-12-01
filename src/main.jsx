import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';

import { HelmetProvider } from 'react-helmet-async';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <FavoritesProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FavoritesProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
