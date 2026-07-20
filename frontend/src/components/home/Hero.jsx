import './Hero.css'

import heroImg from '@/assets/images/heroImg.avif'


function Hero() {
    return (
        <section id="hero">
            <div className="hero-bg-container">
                <img className="hero-image" src={heroImg} alt="Klíma szerelés és karbantartás" />
                <div className="hero-overlay"></div>
            </div>
            <div className="hero-main">
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
        </section>
    )
}

export default Hero