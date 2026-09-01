import PropTypes from 'prop-types'

import './ClientItem.css'

import ActionBtn from '../common/ActionBtn'


function ClientItem({ name, city, phone, onDelete, onEdit }) {

    const handleActionClick = (e, actionFunction) => {
        e.stopPropagation();
        actionFunction();
    };

    return (
        <li className='client-item' onClick={onEdit}>
            <div className='client-details'>
                <p className='client-name'>{name}</p>
                <p className='client-city'>{city}</p>
                <p className='client-phone'>{phone}</p>
            </div>
            <div className='actions'>
                <ActionBtn
                    type='edit'
                    onClick={(e) => handleActionClick(e, onEdit)}
                    ariaLabel={`${name} szerkesztése`}
                />
                <ActionBtn
                    type='delete'
                    onClick={(e) => handleActionClick(e, onDelete)}
                    ariaLabel={`${name} törlése`}
                />
            </div>
        </li>
    )
}

ClientItem.propTypes = {
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
}

export default ClientItem