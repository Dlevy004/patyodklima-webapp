import './Hero.css'

import heroImg from '@/assets/images/heroImg.avif'

import Achievement from './Achievement';


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
            <div className="hero-bg-container">
                <img className="hero-image" src={heroImg} alt="Klíma szerelés és karbantartás" />
                <div className="hero-overlay"></div>
            </div>
            <div className="hero-main">
                <div className='hero-up'>
                    <h1 className="hero-title">Téli melegség, nyári frissesség!</h1>
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
                        achievements.map((item, key) => (
                            <Achievement
                                key={key}
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