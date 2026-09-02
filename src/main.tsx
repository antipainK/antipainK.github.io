import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
/*
 * Self-hosted webfonts — no Google Fonts, so no third-party request and no
 * render-blocking round trip. Subsets and weights are listed one by one on
 * purpose: `@fontsource/<face>/400.css` would also emit the Cyrillic, Greek
 * and Vietnamese woff2 files, none of which this site can render text in.
 * `latin-ext` is what carries the Polish ł, ż and ś.
 */
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-ext-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-ext-500.css';
import '@fontsource/ibm-plex-serif/latin-600.css';
import '@fontsource/ibm-plex-serif/latin-ext-600.css';
import './i18n';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
