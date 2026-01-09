import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Reference from './components/Reference'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Reference />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App
