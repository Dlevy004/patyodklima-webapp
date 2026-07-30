import { motion } from 'motion/react'

import './Hero.css'

import heroImg from '@/assets/images/heroImg.avif'
import Achievement from './Achievement';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};


function Hero() {
    const achievements = [
        {
            number: '5.0',
            title: 'Google értékelés'
        },
        {
            number: '50+',
            title: 'Elégedett ügyfél'
        },
        {
            number: '36',
            title: 'Hónap garancia'
        }
    ];

    return (
        <section id="hero">
        <motion.div
                className="hero-bg-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <img className="hero-image" src={heroImg} alt="Klíma szerelés és karbantartás" />
                <div className="hero-overlay"></div>
            </motion.div>
            <motion.div
                className="hero-main"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className='hero-up'>
                    <motion.h1 className="hero-title" variants={itemVariants}>Téli melegség, nyári frissesség!</motion.h1>
                    <div className="hero-text">
                        <motion.p className="hero-description" variants={itemVariants}>
                            Teljeskörű klímaszolgáltatás Pátyodon és 30 km-es körzetében.{' '}
                            <span>Telepítés</span>, <span>karbantartás</span>, <span>tisztítás</span> &mdash;
                            rövid határidővel, megbízhatóan, garanciával. <br/> Többféle típusú készüléket kínálunk különböző 
                            igényekhez és árkategóriákhoz.
                        </motion.p>
                        <motion.a className="hero-btn" href="#contact" variants={itemVariants}>Foglalj időpontot most!</motion.a>
                    </div>
                </div>
                <motion.div className='hero-achievements' variants={itemVariants}>
                    {
                        achievements.map((item) => (
                            <Achievement
                                key={item.title}
                                number={item.number}
                                title={item.title}
                            />
                        ))
                    }
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero