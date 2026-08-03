import PropTypes from 'prop-types'

import './TopBar.css'

import ProfilPic from '@/assets/images/profile-placeholder.avif'
import HamburgerMenu from '../../common/HamburgerMenu'


function TopBar({ title, onMenuClick, isMobileMenuOpen }) {
    return (
        <header className='top-bar'>
            <div className='top-bar-middle'>
                <h1>{title}</h1>
            </div>
            <div className='profile-section'>
                <button className='profile-btn' aria-label="Profil beállítások">
                    <img src={ProfilPic} alt='Profilkép' className='profile-pic'/>
                </button>

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