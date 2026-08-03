import { ThumbsUp, PhoneCall, Shield, Mail } from 'lucide-react'

import './Footer.css'

import FooterItem from "./FooterItem";
import footerLogo from "@/assets/images/footerLogo.avif"


function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-left">
                    <FooterItem
                        IconComponent={ThumbsUp}
                        itemText="Facebook oldalunk"
                        linkHref="https://www.facebook.com/profile.php?id=61577473041862"
                    />

                    <FooterItem
                        IconComponent={Shield}
                        itemText="Adatkezelési tájékoztató"
                        linkHref={'/privacypolicy'}
                    />
                </div>
                <div className="footer-mid">
                    <a href="/#hero" aria-label='Ugrás az oldal tetejére'>
                        <img src={footerLogo} alt="Pátyod klíma logo" loading="lazy"/>
                    </a>
                </div>
                <div className="footer-right">
                    <FooterItem
                        IconComponent={PhoneCall}
                        itemText="06 30 629 0793"
                        linkHref="tel:+36306290793"
                    />

                    <FooterItem
                        IconComponent={Mail}
                        itemText="klima.patyod@gmail.com"
                        linkHref="mailto:klima.patyod@gmail.com?subject=Contact%20Request"
                    />
                </div>
            </div>

            <div className="footer-bottom">
                <p>Fejlesztette: Daróczi Levente</p>
                <p>Pátyod Klíma &copy; { new Date().getFullYear() } | Minden jog fenntartva!</p>
                <p>Verzió:&nbsp;{' '}
                    <a href="https://github.com/Dlevy004/patyod-klima-website/blob/main/CHANGELOG.md"
                        target="_blank" rel="noopener noreferrer">
                         v1.2.0
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default Footer;