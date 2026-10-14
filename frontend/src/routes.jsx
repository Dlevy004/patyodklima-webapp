import { lazy } from 'react';
import App from './App';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ProtectedRoute = lazy(() => import('./components/admin/auth/ProtectedRoute'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Clients = lazy(() => import('./pages/admin/Clients'));
const Jobs = lazy(() => import('./pages/admin/Jobs'));
const VisualDesign = lazy(() => import('./pages/admin/VisualDesign'));
const References = lazy(() => import('./pages/admin/References'));
const Marketing = lazy(() => import('./pages/admin/Marketing'));
const NotFound = lazy(() => import('./pages/not-found/NotFound'));

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'privacypolicy', element: <PrivacyPolicy /> },
      {
        path: 'admin/login',
        element: (
          <AuthProvider>
            <Login />
          </AuthProvider>
        ),
      },
      {
        path: 'admin',
        element: (
          <AuthProvider>
            <ProtectedRoute />
          </AuthProvider>
        ),
        children: [
          {
            path: '',
            element: <AdminLayout />,
            children: [
              { index: true, path: '', element: <Dashboard /> },
              { path: 'clients', element: <Clients /> },
              { path: 'jobs', element: <Jobs /> },
              { path: 'visual-designs', element: <VisualDesign /> },
              { path: 'marketings', element: <Marketing /> },
              { path: 'references', element: <References /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];