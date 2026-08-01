import './Hero.css'

import heroImg from '@/assets/images/heroImg.avif'
import Milestone from './Milestone';

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

function Hero() {
    return (
        <section id="hero" aria-labelledby='hero-title'>
            <div className="hero-bg-container" aria-hidden='true'>
                <img className="hero-image" src={heroImg} alt="Klíma szerelés és karbantartás" loading='lazy'/>
                <div className="hero-overlay"></div>
            </div>
            <div className="hero-main">
                <div className='hero-up'>
                    <h1 id='hero-title' className="hero-title">Téli melegség, nyári frissesség!</h1>
                    <div className="hero-text">
                        <p className="hero-description">
                            Teljeskörű klímaszolgáltatás Pátyodon és 30 km-es körzetében.{' '}
                            <span>Telepítés</span>, <span>karbantartás</span>, <span>tisztítás</span> &mdash;
                            rövid határidővel, megbízhatóan, garanciával. <br/> Többféle típusú készüléket kínálunk különböző 
                            igényekhez és árkategóriákhoz.
                        </p>
                        <a className="hero-btn" href="#contact">Foglalj időpontot most!</a>
                    </div>
                </div>
                <div className='hero-achievements'>
                    {
                        achievements.map((item) => (
                            <Milestone
                                key={item.title}
                                number={item.number}
                                title={item.title}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Hero