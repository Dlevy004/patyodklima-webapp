import heroImg from '../assets/images/heroImg.avif'

function Hero() {
    return (
        <section id="hero">
            <h1 className="hero-title">Téli melegség, nyári frissesség!</h1>
            <div className="hero-main">
                <div className="hero-left">
                    <div className="hero-text">
                        <p className="hero-description">
                            Teljeskörű klímaszolgáltatás Pátyodon és 30 km-es körzetében.
                            <span>Telepítés</span>, <span>karbantartás</span>, <span>tisztítás</span> &mdash;
                            <mark>rövid határidővel</mark>, <mark>megbízhatóan</mark>, <mark>garanciával</mark>.
                        </p>
                        <p className="hero-description">
                            Többféle típusú készüléket kínálunk különböző igényekhez és árkategóriákhoz.
                        </p>
                        <a className="hero-btn" href="#contact">Foglalj időpontot most!</a>
                    </div>
                </div>
                <div className="hero-right">
                    <img src={heroImg} alt="Beltéri egység telepítése, karbantartása"/>
                </div>
            </div>
        </section>
    )
}

export default Hero