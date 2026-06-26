import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ScrollUp from '@/components/common/ScrollUp'
import CookiePanel from '@/components/common/CookiePanel'
import PrivacyContent from '@/components/privacypolicy/PrivacyContent'
import useDocumentTitle from '../hooks/useDocumentTitle'

function PrivacyPolicy() {
    useDocumentTitle('Pátyod Klíma | Adatkezelési tájékoztató')

    return(
        <>
            <Navbar />
            <main>
                <PrivacyContent />
                <Footer />
                <ScrollUp />
                <CookiePanel />
            </main>
        </>
    )
}

export default PrivacyPolicy