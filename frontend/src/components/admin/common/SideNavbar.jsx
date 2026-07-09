import { useState, useEffect } from 'react'

import PropTypes from 'prop-types'

import './SideNavbar.css'

import NavButton from './NavButton'
import NavSection from './NavSection'

import HomeIcon from '../../icons/HomeIcon'
import ClientPageIcon from '../../icons/ClientPageIcon'
import JobPageIcon from '../../icons/JobPageIcon'
import ErrorIcon from '../../icons/ErrorIcon'
import VisualDesignIcon from '../../icons/VisualDesignIcon'
import PhotoGalleryIcon from '../../icons/PhotoGalleryIcon'
import HvacIcon from '../../icons/HvacIcon'
import HideIcon from '../../icons/BackToTopIcon'

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
            <NavButton IconComponent={HomeIcon} title='Főoldal' url='/admin' />
            <NavSection title='Adminisztráció' ButtonComponents={[
                <NavButton key='client-page' IconComponent={ClientPageIcon} title='Ügyfélnapló' url='/admin/clients' />,
                <NavButton key='job-page' IconComponent={JobPageIcon} title='Munkanapló' url='/admin/jobs' />,
                <NavButton key='error-page' IconComponent={ErrorIcon} title='Bejelentések' url='/admin/errors' />,
            ]} />
            <NavSection title='Értékesítés' ButtonComponents={[
                <NavButton key='ai-page' IconComponent={VisualDesignIcon} title='Látványterv' url='/admin/visualdesigns' />
            ]} />
            <NavSection title='Marketing' ButtonComponents={[
                <NavButton key='reference-page' IconComponent={PhotoGalleryIcon} title='Referencia' url='/admin/references' />,
                <NavButton key='ads-page' IconComponent={HvacIcon} title='Hirdetések' url='/admin/ads' />
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
                    <HideIcon />
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