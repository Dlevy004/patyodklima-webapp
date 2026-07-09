import PropTypes from "prop-types"

import './ModalBackdrop.css'


function ModalBackdrop({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className='backdrop' onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

ModalBackdrop.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ModalBackdrop