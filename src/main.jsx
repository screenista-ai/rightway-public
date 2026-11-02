import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './globals.css';

try {
  localStorage.removeItem('rightway-theme');
} catch {
  /* ignore */
}
document.documentElement.classList.remove('dark');
document.documentElement.style.colorScheme = 'light';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

