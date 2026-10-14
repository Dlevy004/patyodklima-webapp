import { useEffect, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'motion/react'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'

import { TitleProvider } from './context/TitleContext.jsx'
import { getStoredDarkMode } from './utils/theme'

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('darkmode', getStoredDarkMode());
    }
  }, []);

  return (
    <HelmetProvider>
      <TitleProvider>
        <LazyMotion features={domAnimation} strict>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
          <Toaster position="bottom-right" />
        </LazyMotion>
      </TitleProvider>
    </HelmetProvider>
  )
}

export default App