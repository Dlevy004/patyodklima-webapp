import PropTypes from 'prop-types';
import { Trash2 } from 'lucide-react';

import './ActionButtons.css';

function DeleteButton({ onClick, ariaLabel }) {
    return (
        <button
            type='button'
            className='action-btn delete'
            onClick={onClick}
            aria-label={ariaLabel}
            title='Törlés'
        >
            <Trash2 strokeWidth={2} aria-hidden='true' />
        </button>
    );
}

DeleteButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
};

export default DeleteButton;