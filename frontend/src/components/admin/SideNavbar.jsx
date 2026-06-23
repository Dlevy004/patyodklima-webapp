import { useState, useEffect } from 'react'

import './SideNavbar.css'

import NavButton from './common/NavButton'
import NavSection from './common/NavSection'
import HomeIcon from '../icons/HomeIcon'
import ClientPageIcon from '../icons/ClientPageIcon'
import JobPageIcon from '../icons/JobPageIcon'
import ErrorIcon from '../icons/ErrorIcon'
import VisualDesignIcon from '../icons/VisualDesignIcon'
import PhotoGalleryIcon from '../icons/PhotoGalleryIcon'
import HvacIcon from '../icons/HvacIcon'
import HideIcon from '../icons/BackToTopIcon'
import horizontalLogo from '../../assets/images/logo.avif'
import verticalLogo from '../../assets/images/tr-logo-icon.avif'

function SideNavbar() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const savedState = localStorage.getItem('isSidebarCollapsed');
        return savedState === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isSidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    return (
        <div className={isCollapsed ? 'sidenav-collapsed' : 'sidenav-container' }>
            <div className='sidenav-top'>
                <a href='/admin'>
                    <img src={isCollapsed ? verticalLogo : horizontalLogo} className='logo' alt='Pátyod Klíma logo'/>
                </a>
                <NavButton IconComponent={HomeIcon} title='Főoldal' className='sidebar-btn' url='/admin' />
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
            </div>
            <div className='sidenav-bottom'>
                <p>Fejlesztette: Daróczi Levente</p>
                <p>Verzió: v2.0.0</p>
            </div>
            <button className='hide-btn'
                onClick={() => setIsCollapsed(prev => !prev)}>
                <HideIcon />
            </button>
        </div>
    )
}

export default SideNavbar