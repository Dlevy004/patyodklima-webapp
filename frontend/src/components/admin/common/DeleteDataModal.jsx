import PropTypes from 'prop-types';

import './DeleteDataModal.css'


function DeleteDataModal({ titleData, descriptionData, onClose, onDelete }) {
    return (
        <div className='delete-modal'>
            <div className='title-bg'>
                <h1>{titleData} törlése</h1>
            </div>
            <p className='description'>
                Biztos vagy benne, hogy törlöd a(z) {descriptionData}?
            </p>
            <div className='modal-buttons'>
                <button className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button className='modal-delete-btn' onClick={onDelete}>Törlés</button>
            </div>
        </div>
    )
}

DeleteDataModal.propTypes = {
    titleData: PropTypes.string.isRequired,
    descriptionData: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default DeleteDataModal;