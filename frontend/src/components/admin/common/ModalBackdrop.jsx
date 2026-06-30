import './ModalBackdrop.css'
import PropTypes from "prop-types"

function ModalBackdrop({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className='backdrop' onClick={onClose}>
            {children}
        </div>
    )
}

ModalBackdrop.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ModalBackdrop