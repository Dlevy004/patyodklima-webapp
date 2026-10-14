import { useEffect, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'motion/react'
import { Toaster } from 'react-hot-toast'

import { TitleProvider } from './context/TitleContext.jsx'
import { getStoredDarkMode } from './utils/theme'

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('darkmode', getStoredDarkMode());
    }
  }, []);

  return (
    <TitleProvider>
      <LazyMotion features={domAnimation} strict>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        <Toaster position="bottom-right" />
      </LazyMotion>
    </TitleProvider>
  )
}

export default App