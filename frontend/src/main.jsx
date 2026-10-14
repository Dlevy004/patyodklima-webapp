import { ViteReactSSG } from 'vite-react-ssg';
import './css/global.css';
import '@fontsource/josefin-sans';

import App from './App.jsx';
import { routes } from './routes.jsx';

export const createApp = ViteReactSSG(
  App,
  { routes }
);