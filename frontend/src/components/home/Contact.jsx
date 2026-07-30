import { ThumbsUp, PhoneCall, Mail } from 'lucide-react'
import { motion } from 'motion/react'

import './Contact.css'

import ContactItem from './ContactItem.jsx'
import Wave from '@/components/common/Wave'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
};


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
        <section id="contact">
            {/*Photo by Irvin Zheng on Unsplash*/}
            <div className="content">
                <h2 className="sub-title">Elérhetőségeink</h2>
                <motion.div
                    className="contacts"
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {
                        contactItems.map((item) => (
                            <ContactItem
                                key = {item.contactText}
                                IconComponent = {item.IconComponent}
                                isColorChange = {item.isColorChange}
                                contactText = {item.contactText}
                                contactHref = {item.contactHref}
                                variants={itemVariants}
                            />
                        ))
                    }
                </motion.div>
                <Wave />
            </div>
        </section>
    )
}

export default Contact;