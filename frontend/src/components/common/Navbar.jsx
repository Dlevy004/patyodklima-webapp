import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Navbar.css'

import patyodklimaLogo from '@/assets/images/logo.avif'
import LightModeIcon from '@/components/icons/LightModeIcon'
import DarkModeIcon from '@/components/icons/DarkModeIcon'
import HamburgerMenuIcon from '@/components/icons/HamburgerMenuIcon'
import closeIcon from '@/assets/icons/close.svg'


function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.toggle('darkmode', isDarkModeEnabled)
        localStorage.setItem('darkmode', isDarkModeEnabled ? 'active' : null)
    }, [isDarkModeEnabled])

    const scrollToSection = (sectionId) => {
        if (window.location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
        else {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <header>
            <div className="nav-container">
                <nav id="navbar">
                    <a href="/#hero">
                        <img src={patyodklimaLogo} className="logo" alt="Pátyod Klíma - Főoldal"/>
                    </a>
                    <ul className="nav-menu">
                        <li><button className="nav-link" onClick={() => scrollToSection("hero")}>Rólunk</button></li>
                        <li><button className="nav-link" onClick={() => scrollToSection("services")}>Szolgáltatásaink</button></li>
                        <li><button className="nav-link" onClick={() => scrollToSection("reference")}>Referencia</button></li>
                    </ul>
                    <div className="navbar-right">
                        <button className="btn-contact" onClick={() => scrollToSection("contact")}>Kapcsolat</button>
                        <button 
                            className="theme-switch" 
                            aria-label="Témaváltás (sötét/világos)"
                            onClick={() => setIsDarkModeEnabled(prev => !prev)}>
                            { isDarkModeEnabled 
                                ? (<DarkModeIcon className="my-icon"/>)
                                : (<LightModeIcon className="my-icon"/>)
                            }
                        </button>
                    </div>
                    <button 
                        className="hamburger" 
                        aria-label="Menü megnyitása"
                        onClick = {() => setIsMobileMenuOpen(true)}
                    >
                        <HamburgerMenuIcon className="hamburger-icon"/>
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
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("hero")}>Rólunk</button></li>
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("services")}>Szolgáltatásaink</button></li>
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("reference")}>Referencia</button></li>
                </ul>
                <div className="mobile-navbar-right">
                    <button className="mobile-btn-contact" onClick={() => scrollToSection("contact")}>Kapcsolat</button>
                    <button 
                        className="theme-switch" 
                        aria-label="Témaváltás (sötét/világos)"
                        onClick={() => setIsDarkModeEnabled(prev => !prev)}>
                        { isDarkModeEnabled 
                            ? (<DarkModeIcon className="my-icon"/>)
                            : (<LightModeIcon className="my-icon"/>)
                        }
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar