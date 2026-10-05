import { lazy, Suspense } from 'react';

import Navbar from '../components/common/Navbar'
import Hero from '../components/home/Hero'
import Logos from '../components/home/Logos'
import Services from '../components/home/Services'
const Reference = lazy(() => import('../components/home/Reference'));
import Contact from '../components/home/Contact'
const FAQSection = lazy(() => import('../components/home/FAQSection'));
import Footer from '../components/common/Footer'
import ScrollUp from '../components/common/ScrollUp'
import CookiePanel from '../components/common/CookiePanel'
import Seo from '../components/common/Seo'
import BusinessSchema from '../components/common/BusinessSchema'


function Home() {
    return(
        <>
            <Seo
                title={'Pátyod Klíma | Klímaszerelés, karbantartás és ingyenes felmérés'}
                description={'Klímaszolgáltatás Pátyodon és 30 km-es körzetében. Ingyenes felmérés! Telepítés, karbantartás, tisztítás - gyorsan, garanciával, rövid határidővel'}
                url="/"
            />
            <BusinessSchema/>

            <Navbar />
            <main>
                <Hero />
                <Logos />
                <Services />

                <Suspense fallback={null}>
                    <Reference />
                </Suspense>
                <Suspense fallback={null}>
                    <FAQSection />
                </Suspense>

                <Contact />
                <Footer />
                <ScrollUp />
                <CookiePanel />
            </main>
        </>
    )
}

export default Home