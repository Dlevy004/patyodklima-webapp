import Navbar from '../components/common/Navbar'
import Hero from '../components/home/Hero'
import Services from '../components/home/Services'
import Reference from '../components/home/Reference'
import Contact from '../components/home/Contact'
import Footer from '../components/common/Footer'
import ScrollUp from '../components/common/ScrollUp'
import CookiePanel from '../components/common/CookiePanel'
import useDocumentTitle from './useDocumentTitle'

function Home() {
    useDocumentTitle('Pátyod Klíma | Klímaszerelés, karbantartás és ingyenes felmérés');

    return(
        <>
            <Navbar />
            <main>
                <Hero />
                <Services />
                <Reference />
                <Contact />
                <Footer />
                <ScrollUp />
                <CookiePanel />
            </main>
        </>
    )
}

export default Home