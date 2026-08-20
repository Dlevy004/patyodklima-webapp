import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ScrollUp from '@/components/common/ScrollUp'
import CookiePanel from '@/components/common/CookiePanel'
import Seo from '@/components/common/Seo'
import PrivacyContent from '@/components/privacypolicy/PrivacyContent'


function PrivacyPolicy() {
    return(
        <>
            <Seo
                title={'Pátyod Klíma | Adatkezelési tájékoztató'}
                description={'A Pátyod Klíma hivatalos adatkezelési tájékoztatója. Ismerje meg, hogyan kezeljük és védjük a személyes adatait az oldal használata során.'}
                url="/privacypolicy"
            />

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