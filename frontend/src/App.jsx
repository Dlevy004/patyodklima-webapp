import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useLayoutEffect } from 'react'

import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { getStoredDarkMode } from './utils/theme';
import ProtectedRoute from './components/admin/auth/ProtectedRoute'

const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Clients = lazy(() => import('./pages/admin/Clients'))
const Jobs = lazy(() => import('./pages/admin/Jobs'))
const VisualDesign = lazy(() => import('./pages/admin/VisualDesign'))
const References = lazy(() => import('./pages/admin/References'))
const Marketing = lazy(() => import('./pages/admin/Marketing'))
const NotFound = lazy(() => import('./pages/not-found/NotFound'))


function App() {
  useLayoutEffect(() => {
    document.body.classList.toggle('darkmode', getStoredDarkMode());
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/privacypolicy' element={<PrivacyPolicy />} />

            <Route path='/admin/login' element={<Login />} />

            <Route path='/admin' element={<ProtectedRoute />}>
              <Route element={<AdminLayout/>}>
                <Route index element={<Dashboard />} />
                <Route path='clients' element={<Clients />} />
                <Route path='jobs' element={<Jobs />} />
                <Route path='visual-designs' element={<VisualDesign />} />
                <Route path='marketings' element={<Marketing />} />
                <Route path='references' element={<References />} />
              </Route>
            </Route>

            <Route path='*' element={<NotFound />}/>
          </Routes>
        </Suspense>

        <Toaster position='bottom-right'/>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App