import PropTypes from 'prop-types'

import './ClientItem.css'

import EditBtn from '../common/EditBtn';
import DeleteBtn from '../common/DeleteBtn';


function ClientItem({ name, city, phone, onDelete, onEdit }) {
    return (
        <li className='client-item'>
            <div className='client-details'>
                <p className='client-name'>{name}</p>
                <p className='client-city'>{city}</p>
                <p className='client-phone'>{phone}</p>
            </div>
            <div className='actions'>
                <EditBtn onClick={onEdit} ariaLabel={`${name} szerkesztése`} />
                <DeleteBtn onClick={onDelete} ariaLabel={`${name} törlése`} />
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