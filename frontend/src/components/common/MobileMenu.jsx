import './MobileMenu.css'
import PropTypes from 'prop-types'
import CloseMenuIcon from '@/components/icons/CloseMenuIcon'

function MobileMenu({ isOpen, onClose, children }) {
    return (
        <div className={`nav-mobile ${isOpen ? 'show' : ''}`}>
            <button
                className="close-btn"
                aria-label="Menü bezárása"
                onClick={onClose}
            >
                <CloseMenuIcon className="close-icon"/>
            </button>
            <div className="mobile-menu-content">
                {children}
            </div>
        </div>
    )
}

MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
}

export default MobileMenu