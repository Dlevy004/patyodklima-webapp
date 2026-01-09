import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Reference from './components/Reference'
import Contact from './components/Contact'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Reference />
        <Contact />
      </main>
    </>
  )
}

export default App
