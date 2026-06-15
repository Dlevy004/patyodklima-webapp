import { useEffect, useState } from 'react'
import './Navbar.css'
import patyodklimaLogo from '@/assets/images/logo.avif'
import lightModeImg from '@/assets/icons/light-blue.svg'
import darkModeImg from '@/assets/icons/dark-blue.svg'
import hamburgerIcon from '@/assets/icons/hamburger.svg'
import closeIcon from '@/assets/icons/close.svg'


function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('darkmode', isDarkModeEnabled)
        localStorage.setItem('darkmode', isDarkModeEnabled ? 'active' : null)
    }, [isDarkModeEnabled])

    return (
        <header>
            <div className="nav-container">
                <nav id="navbar">
                    <a href="#hero">
                        <img src={patyodklimaLogo} className="logo" alt="Pátyod Klíma - Főoldal"/>
                    </a>
                    <ul className="nav-menu">
                        <li><a className="nav-link" href="#hero">Rólunk</a></li>
                        <li><a className="nav-link" href="#services">Szolgáltatásaink</a></li>
                        <li><a className="nav-link" href="#reference">Referencia</a></li>
                    </ul>
                    <div className="navbar-right">
                        <a className="btn-contact" href="#contact">Kapcsolat</a>
                        <button 
                            className="theme-switch" 
                            aria-label="Témaváltás (sötét/világos)"
                            onClick={() => setIsDarkModeEnabled(prev => !prev)}>
                            <img 
                                className="darkmode-img" 
                                src={isDarkModeEnabled ? darkModeImg : lightModeImg} 
                                alt="" aria-hidden="true" />
                        </button>
                    </div>
                    <button 
                        className="hamburger" 
                        aria-label="Menü megnyitása"
                        onClick = {() => setIsMobileMenuOpen(true)}
                    >
                        <img src={hamburgerIcon} alt="" aria-hidden="true"/>
                    </button>
                </nav>
            </div>
            <div className={`nav-mobile ${isMobileMenuOpen ? 'show' : ''}`}>
                <button 
                    className="close-btn" 
                    aria-label="Menü bezárása"
                    onClick = {() => setIsMobileMenuOpen(false)}
                >
                    <img src={closeIcon} alt="" aria-hidden="true"/>
                </button>
                <ul className="mobile-nav-menu">
                    <li><a className="mobile-nav-link" href="#hero" onClick={() => setIsMobileMenuOpen(false)}>Rólunk</a></li>
                    <li><a className="mobile-nav-link" href="#services" onClick={() => setIsMobileMenuOpen(false)}>Szolgáltatásaink</a></li>
                    <li><a className="mobile-nav-link" href="#reference" onClick={() => setIsMobileMenuOpen(false)}>Referencia</a></li>
                </ul>
                <div className="mobile-navbar-right">
                    <a className="mobile-btn-contact" href="#contact">Kapcsolat</a>
                    <button 
                        className="theme-switch" 
                        aria-label="Témaváltás (sötét/világos)"
                        onClick={() => setIsDarkModeEnabled(prev => !prev)}>
                        <img 
                            className="darkmode-img" 
                            src={isDarkModeEnabled ? darkModeImg : lightModeImg} 
                            alt="" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar