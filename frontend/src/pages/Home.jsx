import { lazy, Suspense } from 'react';

import Navbar from '../components/common/Navbar'
import Hero from '../components/home/Hero'
import Logos from '../components/home/Logos'
import Services from '../components/home/Services'
const Reference = lazy(() => import('../components/home/Reference'));
const Contact = lazy(() => import('../components/home/Contact'));
const FAQSection = lazy(() => import('../components/home/FAQSection'));
const CookiePanel = lazy(() => import('../components/common/CookiePanel'));
const Footer = lazy(() => import('../components/common/Footer'));
const ScrollUp = lazy(() => import('../components/common/ScrollUp'));
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

                <Suspense fallback={null}><Reference /></Suspense>
                <Suspense fallback={null}><FAQSection /></Suspense>
                <Suspense fallback={null}><Contact /></Suspense>
            </main>

            <Suspense fallback={null}>
                <Footer />
                <ScrollUp />
            </Suspense>
            <Suspense fallback={null}><CookiePanel /></Suspense>
        </>
    )
}

export default Home