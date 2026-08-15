import PropTypes from 'prop-types';
import { SquarePen } from 'lucide-react';

import './ActionButtons.css';

function EditButton({ onClick, ariaLabel }) {
    return (
        <button
            type='button'
            className='action-btn edit'
            onClick={onClick}
            aria-label={ariaLabel}
            title='Szerkesztés'
        >
            <SquarePen strokeWidth={2} aria-hidden='true' />
        </button>
    );
}

EditButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
};

export default EditButton;