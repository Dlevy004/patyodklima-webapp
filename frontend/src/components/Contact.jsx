import './Contact.css'
import ContactItem from './ContactItem.jsx'

import defaultCallIcon from '../assets/icons/call_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverCallIcon from '../assets/icons/call_24dp_228FCE_FILL1_wght400_GRAD0_opsz24.svg'
import defaultLikeIcon from '../assets/icons/thumb_up_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverLikeIcon from '../assets/icons/thumb_up_24dp_FFFFFF_FILL1_wght400_GRAD0_opsz24.svg'
import defaultMailIcon from '../assets/icons/mail_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverMailIcon from '../assets/icons/mail_blue.svg'

function Contact() {
    return (
        <section id="contact">
            {/*Photo by Irvin Zheng on Unsplash*/}
            <div className="content">
                <h2 className="sub-title">Elérhetőségeink</h2>
                <div className="contacts">
                    <ContactItem 
                        defaultIconSrc = {defaultCallIcon}
                        hoverIconSrc = {hoverCallIcon}
                        contactText = '06 30 629 0793'
                        contactHref = 'tel:+36306290793'
                    />

                    <ContactItem 
                        defaultIconSrc = {defaultLikeIcon}
                        hoverIconSrc = {hoverLikeIcon}
                        contactText = 'Kövess Facebookon!'
                        contactHref = 'https://www.facebook.com/profile.php?id=61577473041862'
                    />

                    <ContactItem 
                        defaultIconSrc = {defaultMailIcon}
                        hoverIconSrc = {hoverMailIcon}
                        contactText = 'Írj nekünk e-mailt!'
                        contactHref = 'mailto:klima.patyod@gmail.com'
                    />
                </div>
            </div>

            <div className="footer-wave">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" aria-hidden="true">
                    <path fillOpacity="1"
                        d="M0,160L80,170.7C160,181,320,203,480,202.7C640,203,800,181,960,170.7C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z">
                    </path>
                </svg>
            </div>
        </section>
    )
}

export default Contact;