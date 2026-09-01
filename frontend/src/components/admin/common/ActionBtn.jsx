import PropTypes from 'prop-types';
import {
    SquarePen, Trash2,
    Eye, EyeOff,
    Download
} from 'lucide-react';

import './ActionButtons.css';

const buttonTypes = {
    edit: {
        title: 'Szerkesztés',
        icon: <SquarePen strokeWidth={2} aria-hidden='true' />
    },
    delete: {
        title: 'Törlés',
        icon: <Trash2 strokeWidth={2} aria-hidden='true' />
    },
    visible: {
        title: 'Láthatóság',
        icon: <Eye strokeWidth={2} aria-hidden='true' />
    },
    invisible: {
        title: 'Elrejtés',
        icon: <EyeOff strokeWidth={2} aria-hidden='true' />
    }
}


function ActionButton({ type, onClick }) {
    return (
        <button
            type='button'
            className={`action-btn ${type}`}
            onClick={onClick}
            aria-label={`${buttonTypes[type]?.title} gomb`}
            title={buttonTypes[type]?.title}
        >
            {buttonTypes[type]?.icon}
        </button>
    );
}

ActionButton.propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ActionButton;