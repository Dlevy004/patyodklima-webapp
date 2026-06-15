import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ScrollUp from '@/components/common/ScrollUp'
import CookiePanel from '@/components/common/CookiePanel'
import PrivacyContent from '@/components/privacypolicy/PrivacyContent'

function PrivacyPolicy() {
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