import { ViteReactSSG } from 'vite-react-ssg';
import './css/global.css';
import '@fontsource/josefin-sans';

import { routes } from './routes.jsx';

export const createRoot = ViteReactSSG({ routes });