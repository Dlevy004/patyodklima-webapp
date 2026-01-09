import FooterItem from "./FooterItem";
import './Footer.css'

import facebookIcon from "../assets/icons/like.svg"
import shieldIcon from "../assets/icons/admin_panel.svg"
import footerLogo from "../assets/images/footerLogo.avif"
import callIcon from "../assets/icons/call.svg"
import mailIcon from "../assets/icons/mail.svg"
import pdf from "../assets/patyodklima-adatkezelesi-tajekoztato.pdf"

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-left">
                    <FooterItem
                        iconSrc={facebookIcon}
                        itemText="Facebook oldalunk"
                        linkHref="https://www.facebook.com/profile.php?id=61577473041862"
                    />

                    <FooterItem
                        iconSrc={shieldIcon}
                        itemText="Adatkezelési tájékoztató"
                        linkHref={pdf}
                    />
                </div>
                <div className="footer-mid">
                    <a href="#hero">
                        <img src={footerLogo} alt="Pátyod klíma logo - Ugrás a tetejére" loading="lazy"/>
                    </a>
                </div>
                <div class="footer-right">
                    <FooterItem
                        iconSrc={callIcon}
                        itemText="06 30 629 0793"
                        linkHref="tel:+36306290793"
                    />

                    <FooterItem
                        iconSrc={mailIcon}
                        itemText="klima.patyod@gmail.com"
                        linkHref="mailto:klima.patyod@gmail.com?subject=Contact%20Request"
                    />
                </div>
            </div>

            <div className="footer-bottom">
                <p>Fejlesztette: Daróczi Levente</p>
                <p>Pátyod Klíma &copy; 2025 | Minden jog fenntartva!</p>
                <p>Verzió-
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