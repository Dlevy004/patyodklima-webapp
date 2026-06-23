import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
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
        <Route path='/admin' element={<Dashboard />} />
        <Route path='/admin/clients' element={<Clients />} />
        <Route path='/admin/jobs' element={<Jobs />} />
        <Route path='/admin/errors' element={<Errors />} />
        <Route path='/admin/visualdesigns' element={<VisualDesign />} />
        <Route path='/admin/ads' element={<Ads />} />
        <Route path='/admin/references' element={<References />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App