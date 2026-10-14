import { m } from 'motion/react'

import './Hero.css'

import Milestone from './Milestone';
import { fadeInContainer, fadeInUp } from '@/animations/variants';

const milestones = [
    { toNumber: 5, title: 'Google értékelés', decimals: 1, suffix: '' },
    { toNumber: 50, title: 'Elégedett ügyfél', decimals: 0, suffix: '+' },
    { toNumber: 36, title: 'Hónap garancia', decimals: 0, suffix: '' }
];

const containerVariants = fadeInContainer(0.12, 0);
const itemVariants = fadeInUp(0.5);


function Hero() {
    return (
        <section id="hero" aria-labelledby='hero-title'>
            <div
                className="hero-bg-container"
                aria-hidden='true'
            >
                <img className="hero-image" src="/images/heroImg.avif" alt="Klíma szerelés és karbantartás" fetchPriority='high' decoding="async"/>
                <div className="hero-overlay"></div>
            </div>
            <m.div
                className="hero-main"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className='hero-up'>
                    <m.h1 id='hero-title' className="hero-title" variants={itemVariants}>Téli melegség, nyári frissesség!</m.h1>
                    <div className="hero-text">
                        <m.p className="hero-description" variants={itemVariants}>
                            Teljeskörű klímaszolgáltatás Pátyodon és 30 km-es körzetében.{' '}
                            <span>Telepítés</span>, <span>karbantartás</span>, <span>tisztítás</span> &mdash;
                            rövid határidővel, megbízhatóan, garanciával. <br/> Többféle típusú készüléket kínálunk különböző
                            igényekhez és árkategóriákhoz.
                        </m.p>
                        <m.a className="hero-btn" href="#contact" variants={itemVariants}>Foglalj időpontot most!</m.a>
                    </div>
                </div>
                <m.div className='hero-achievements' variants={itemVariants}>
                    {
                        milestones.map((item) => (
                            <Milestone
                                key={item.title}
                                toNumber={item.toNumber}
                                title={item.title}
                                decimals={item.decimals}
                                suffix={item.suffix}
                            />
                        ))
                    }
                </m.div>
            </m.div>
        </section>
    )
}

export default Hero