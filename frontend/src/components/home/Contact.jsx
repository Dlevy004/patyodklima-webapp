import './Contact.css'
import ContactItem from './ContactItem.jsx'

import Wave from '@/components/common/Wave'
import PhoneIcon from '@/components/icons/PhoneIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'
import MailIcon from '@/components/icons/MailIcon'

function Contact() {
    return (
        <section id="contact">
            {/*Photo by Irvin Zheng on Unsplash*/}
            <div className="content">
                <h2 className="sub-title">Elérhetőségeink</h2>
                <div className="contacts">
                    <ContactItem 
                        IconComponent = {PhoneIcon}
                        isColorChange = {true}
                        contactText = '06 30 629 0793'
                        contactHref = 'tel:+36306290793'
                    />

                    <ContactItem 
                        IconComponent = {FacebookIcon}
                        isColorChange = {true}
                        contactText = 'Kövess Facebookon!'
                        contactHref = 'https://www.facebook.com/profile.php?id=61577473041862'
                    />

                    <ContactItem 
                        IconComponent = {MailIcon}
                        isColorChange = {true}
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