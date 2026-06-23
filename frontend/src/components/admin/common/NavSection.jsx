import PropTypes from "prop-types"
import './NavSection.css'

function NavSection({ title, ButtonComponents = [] }) {
    return (
        <div className='nav-section'>
            <p className='nav-section-title'>{title}</p>
            <div className='nav-section-buttons'>
                {ButtonComponents.map((Button, index) => (
                    <div key={index} className='nav-section-button'>
                        {Button}
                    </div>
                ))}
            </div>
        </div>
    )
}

NavSection.propTypes = {
    title: PropTypes.string.isRequired,
    ButtonComponents: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default NavSection