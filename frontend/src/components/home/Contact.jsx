import './Contact.css'
import ContactItem from './ContactItem.jsx'
import Wave from '@/components/common/Wave'

import defaultCallIcon from '@/assets/icons/call_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverCallIcon from '@/assets/icons/call_24dp_228FCE_FILL1_wght400_GRAD0_opsz24.svg'
import defaultLikeIcon from '@/assets/icons/thumb_up_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverLikeIcon from '@/assets/icons/thumb_up_24dp_FFFFFF_FILL1_wght400_GRAD0_opsz24.svg'
import defaultMailIcon from '@/assets/icons/mail_24dp_F_FILL0_wght400_GRAD0_opsz24.svg'
import hoverMailIcon from '@/assets/icons/mail_blue.svg'

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
                <Wave />
            </div>
        </section>
    )
}

export default Contact;