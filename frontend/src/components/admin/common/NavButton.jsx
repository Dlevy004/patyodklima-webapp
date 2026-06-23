import PropTypes from "prop-types"
import './NavButton.css'

function NavButton({ IconComponent, title, url }) {
    const isActive = globalThis.location.pathname === url;

    return (
        <a href={url} className={`nav-button ${isActive ? 'active' : ''}`}>
            <IconComponent />
            <p className="btn-title">{title}</p>
        </a>
    )
}

NavButton.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
}

export default NavButton