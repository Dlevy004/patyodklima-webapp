import { motion } from 'motion/react'

import './Hero.css'

import heroImg from '@/assets/images/heroImg.avif'
import Milestone from './Milestone';
import { fadeInContainer, fadeInUp } from '@/animations/variants';

const achievements = [
    { number: '5.0', title: 'Google értékelés' },
    { number: '50+', title: 'Elégedett ügyfél' },
    { number: '36', title: 'Hónap garancia' }
];

const containerVariants = fadeInContainer();
const itemVariants = fadeInUp();


function Hero() {
    return (
        <section id="hero" aria-labelledby='hero-title'>
            <motion.div
                className="hero-bg-container"
                aria-hidden='true'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <img className="hero-image" src={heroImg} alt="Klíma szerelés és karbantartás" loading='lazy'/>
                <div className="hero-overlay"></div>
            </motion.div>
            <motion.div
                className="hero-main"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className='hero-up'>
                    <motion.h1 id='hero-title' className="hero-title" variants={itemVariants}>Téli melegség, nyári frissesség!</motion.h1>
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
                            <Milestone
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