import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { Toaster } from 'react-hot-toast'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Clients from './pages/admin/Clients'
import Jobs from './pages/admin/Jobs'
import Errors from './pages/admin/Errors'
import VisualDesign from './pages/admin/VisualDesign'
import References from './pages/admin/References'
import Ads from './pages/admin/Ads'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/privacypolicy' element={<PrivacyPolicy />} />

        <Route path='/admin' element={<AdminLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path='clients' element={<Clients />} />
          <Route path='jobs' element={<Jobs />} />
          <Route path='errors' element={<Errors />} />
          <Route path='visualdesigns' element={<VisualDesign />} />
          <Route path='ads' element={<Ads />} />
          <Route path='references' element={<References />} />
        </Route>
      </Routes>

      <Toaster position='bottom-right'/>
    </BrowserRouter>
  )
}

export default App