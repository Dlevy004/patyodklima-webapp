import { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import {
    House, FileUser, BookMarked,
    CircleX, PencilRuler, Images,
    AirVent, ChevronUp
} from 'lucide-react'

import './SideNavbar.css'

import NavButton from './NavButton'
import NavSection from './NavSection'

import horizontalLogo from '../../../assets/images/logo.avif'
import verticalLogo from '../../../assets/images/tr-logo-icon.avif'

import MobileMenu from '../../common/MobileMenu'


function SideNavbar({ isMobileMenuOpen, closeMobileMenu }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const savedState = localStorage.getItem('isSidebarCollapsed');
        return savedState === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isSidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    const adminNavLinks = (
        <>
            <NavButton IconComponent={House} title='Főoldal' url='/admin' onClick={closeMobileMenu} />
            <NavSection title='Adminisztráció' ButtonComponents={[
                <NavButton key='client-page' IconComponent={FileUser} title='Ügyfélnapló' url='/admin/clients' onClick={closeMobileMenu} />,
                <NavButton key='job-page' IconComponent={BookMarked} title='Munkanapló' url='/admin/jobs' onClick={closeMobileMenu} />,
                <NavButton key='error-page' IconComponent={CircleX} title='Bejelentések' url='/admin/errors' onClick={closeMobileMenu} />,
            ]} />
            <NavSection title='Értékesítés' ButtonComponents={[
                <NavButton key='ai-page' IconComponent={PencilRuler} title='Látványterv' url='/admin/visualdesigns' onClick={closeMobileMenu} />
            ]} />
            <NavSection title='Marketing' ButtonComponents={[
                <NavButton key='reference-page' IconComponent={Images} title='Referencia' url='/admin/references' onClick={closeMobileMenu} />,
                <NavButton key='ads-page' IconComponent={AirVent} title='Hirdetések' url='/admin/ads' onClick={closeMobileMenu} />
            ]} />
        </>
    )

    return (
        <>
            <nav className={isCollapsed ? 'sidenav-collapsed' : 'sidenav-container' } aria-label="Adminisztrációs menü">
                <div className='sidenav-top'>
                    <a href='/admin' aria-label="Ugrás az admin főoldalra">
                        <img src={isCollapsed ? verticalLogo : horizontalLogo} className='pkLogo' alt='Pátyod Klíma logo'/>
                    </a>
                    {adminNavLinks}
                </div>
                <button
                    className='hide-btn'
                    onClick={() => setIsCollapsed(prev => !prev)}
                    aria-label={isCollapsed ? "Menü kinyitása" : "Menü összecsukása"}
                    aria-expanded={!isCollapsed}
                >
                    <ChevronUp aria-hidden="true"/>
                </button>
            </nav>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} className='admin-mobile-menu' >
                <nav className='admin-mobile-links' onClick={closeMobileMenu} aria-label="Adminisztrációs mobil menü">
                    {adminNavLinks}
                </nav>
            </MobileMenu>
        </>
    )
}

SideNavbar.propTypes = {
    isMobileMenuOpen: PropTypes.bool.isRequired,
    closeMobileMenu: PropTypes.func.isRequired
}

export default SideNavbar