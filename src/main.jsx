import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './globals.css';

(function bootTheme() {
  let theme = 'light';
  try {
    localStorage.removeItem('rightway-theme');
    const saved = localStorage.getItem('rw_theme');
    if (saved === 'dark' || saved === 'light') {
      theme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  } catch {
    /* ignore */
  }
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
