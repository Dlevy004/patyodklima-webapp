import { ThumbsUp, PhoneCall, Mail } from 'lucide-react'

import './Contact.css'

import ContactItem from './ContactItem.jsx'
import Wave from '@/components/common/Wave'


function Contact() {
    const contactItems = [
        {
            IconComponent: PhoneCall,
            isColorChange: true,
            contactText: '06 30 629 0793',
            contactHref: 'tel:+36306290793'
        },
        {
            IconComponent: ThumbsUp,
            isColorChange: true,
            contactText: 'Kövess Facebookon!',
            contactHref: 'https://www.facebook.com/profile.php?id=61577473041862'
        },
        {
            IconComponent: Mail,
            isColorChange: true,
            contactText: 'Írj nekünk e-mailt!',
            contactHref: 'mailto:klima.patyod@gmail.com'
        }
    ];

    return (
        <section id="contact" aria-labelledby="contact-heading">
            <div className="content">
                <h2 className="sub-title">Elérhetőségeink</h2>
                <ul className="contacts">
                    {
                        contactItems.map((item) => (
                            <ContactItem
                                key = {item.contactText}
                                IconComponent = {item.IconComponent}
                                isColorChange = {item.isColorChange}
                                contactText = {item.contactText}
                                contactHref = {item.contactHref}
                            />
                        ))
                    }
                </ul>
                <Wave />
            </div>
        </section>
    )
}

export default Contact;