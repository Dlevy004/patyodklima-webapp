import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import './css/global.css'

import App from './App.jsx'
import { TitleProvider } from './context/TitleContext.jsx'

const rootElement = document.getElementById('root');

const app = (
  <HelmetProvider>
    <StrictMode>
      <TitleProvider>
        <App />
      </TitleProvider>
    </StrictMode>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}