import './TopBar.css'
import PropTypes from 'prop-types'
import ProfilPic from '@/assets/images/profile-placeholder.avif'

function TopBar({ title }) {
    return (
        <div className='top-bar'>
            <section className='top-bar-middle'>
                <h1>{title}</h1>
            </section>
            <section className='profile-section'>
                <button className='profile-btn'>
                    <img src={ProfilPic} alt='Profilkép' className='profile-pic'/>
                </button>
            </section>
        </div>
    )
}

TopBar.propTypes = {
    title: PropTypes.string.isRequired
}

export default TopBar