import { useEffect } from 'react'

import PropTypes from 'prop-types'
import { X } from 'lucide-react'

import './MobileMenu.css'


function MobileMenu({ isOpen, onClose, children, className = '' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <div className={`nav-mobile ${isOpen ? 'show' : ''} ${className}`}>
            <button
                className="close-btn"
                aria-label="Menü bezárása"
                onClick={onClose}
            >
                <X className="close-icon"/>
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
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

export default MobileMenu