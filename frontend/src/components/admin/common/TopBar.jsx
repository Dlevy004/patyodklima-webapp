import { useState, useEffect, useRef } from 'react'

import PropTypes from 'prop-types'

import './TopBar.css'

import ProfilPic from '@/assets/images/profile-placeholder.avif'
import HamburgerMenu from '../../common/HamburgerMenu'
import ProfilePanel from './ProfilePanel';


function TopBar({ title, onMenuClick, isMobileMenuOpen }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className='top-bar'>
            <div className='top-bar-middle'>
                <h1>{title}</h1>
            </div>
            <div className='profile-section'>
                <div className="profile-dropdown-wrapper" ref={profileRef}>
                    <button
                        type='button'
                        className='profile-btn'
                        aria-label="Profil beállítások"
                        aria-expanded={isProfileOpen}
                        aria-haspopup="menu"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                    >
                        <img src={ProfilPic} alt='Profilkép' className='profile-pic'/>
                    </button>

                    {isProfileOpen && <ProfilePanel onClose={() => setIsProfileOpen(false)} />}
                </div>

                <div className='mobile-menu-wrapper'>
                    <HamburgerMenu onClick={onMenuClick} isOpen={isMobileMenuOpen}/>
                </div>
            </div>
        </header>
    )
}

TopBar.propTypes = {
    title: PropTypes.string.isRequired,
    onMenuClick: PropTypes.func.isRequired,
    isMobileMenuOpen: PropTypes.bool.isRequired
}

export default TopBar