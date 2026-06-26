import './TopBar.css'
import PropTypes from 'prop-types'
import ProfilPic from '@/assets/images/profile-placeholder.avif'
import HamburgerMenu from '../../common/HamburgerMenu'

function TopBar({ title, onMenuClick }) {
    return (
        <div className='top-bar'>
            <section className='top-bar-middle'>
                <h1>{title}</h1>
            </section>
            <section className='profile-section'>
                <button className='profile-btn'>
                    <img src={ProfilPic} alt='Profilkép' className='profile-pic'/>
                </button>

                <div className='mobile-menu-wrapper'>
                    <HamburgerMenu onClick={onMenuClick}/>
                </div>
            </section>
        </div>
    )
}

TopBar.propTypes = {
    title: PropTypes.string.isRequired,
    onMenuClick: PropTypes.func.isRequired
}

export default TopBar