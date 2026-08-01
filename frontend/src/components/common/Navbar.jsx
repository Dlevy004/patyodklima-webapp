import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'

import './Navbar.css'

import patyodklimaLogo from '@/assets/images/logo.avif'
import HamburgerMenu from './HamburgerMenu'
import MobileMenu from './MobileMenu'
import ThemeSwitcher from './ThemeSwitcher'


function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { scrollY } = useScroll();
    const navWidth = useTransform(scrollY, [0, 1000], ['90%', '75%']);

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
        setIsMobileMenuOpen(false);
    }

    return (
        <header>
            <div className="nav-container">
                <motion.nav
                    id="navbar"
                    style={{
                        width: navWidth,
                        marginInline: 'auto'
                    }}
                >
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
                        <ThemeSwitcher />
                    </div>
                    <HamburgerMenu onClick={() => setIsMobileMenuOpen(prev => !prev)}/>
                </motion.nav>
            </div>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            >
                <ul className="mobile-nav-menu">
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("hero")}>Rólunk</button></li>
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("services")}>Szolgáltatásaink</button></li>
                    <li><button className="mobile-nav-link" onClick={() => scrollToSection("reference")}>Referencia</button></li>
                </ul>
                <div className="mobile-navbar-right">
                    <button className="mobile-btn-contact" onClick={() => scrollToSection("contact")}>Kapcsolat</button>
                    <ThemeSwitcher />
                </div>
            </MobileMenu>
        </header>
    )
}

export default Navbar