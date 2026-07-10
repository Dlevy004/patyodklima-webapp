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
            <NavButton IconComponent={House} title='Főoldal' url='/admin' />
            <NavSection title='Adminisztráció' ButtonComponents={[
                <NavButton key='client-page' IconComponent={FileUser} title='Ügyfélnapló' url='/admin/clients' />,
                <NavButton key='job-page' IconComponent={BookMarked} title='Munkanapló' url='/admin/jobs' />,
                <NavButton key='error-page' IconComponent={CircleX} title='Bejelentések' url='/admin/errors' />,
            ]} />
            <NavSection title='Értékesítés' ButtonComponents={[
                <NavButton key='ai-page' IconComponent={PencilRuler} title='Látványterv' url='/admin/visualdesigns' />
            ]} />
            <NavSection title='Marketing' ButtonComponents={[
                <NavButton key='reference-page' IconComponent={Images} title='Referencia' url='/admin/references' />,
                <NavButton key='ads-page' IconComponent={AirVent} title='Hirdetések' url='/admin/ads' />
            ]} />
        </>
    )

    return (
        <>
            <div className={isCollapsed ? 'sidenav-collapsed' : 'sidenav-container' }>
                <div className='sidenav-top'>
                    <a href='/admin'>
                        <img src={isCollapsed ? verticalLogo : horizontalLogo} className='pkLogo' alt='Pátyod Klíma logo'/>
                    </a>
                    {adminNavLinks}
                </div>
                <button className='hide-btn'
                    onClick={() => setIsCollapsed(prev => !prev)}>
                    <ChevronUp />
                </button>
            </div>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} className='admin-mobile-menu' >
                <div className='admin-mobile-links' onClick={closeMobileMenu}>
                    {adminNavLinks}
                </div>
            </MobileMenu>
        </>
    )
}

SideNavbar.propTypes = {
    isMobileMenuOpen: PropTypes.bool.isRequired,
    closeMobileMenu: PropTypes.func.isRequired
}

export default SideNavbar