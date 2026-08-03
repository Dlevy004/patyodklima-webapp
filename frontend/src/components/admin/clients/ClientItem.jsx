import PropTypes from 'prop-types'
import { SquarePen, Trash2 } from 'lucide-react'

import './ClientItem.css'


function ClientItem({ name, city, phone, onDelete, onEdit }) {
    return (
        <li className='client-item'>
            <div className='client-details'>
                <p className='client-name'>{name}</p>
                <p className='client-city'>{city}</p>
                <p className='client-phone'>{phone}</p>
            </div>
            <div className='actions'>
                <button
                    className='edit-btn'
                    onClick={onEdit}
                    aria-label={`${name} adatainak szerkesztése`}
                    title='Szerkesztés'
                >
                    <SquarePen strokeWidth={2} aria-hidden='true'/>
                </button>
                <button
                    className='delete-btn'
                    onClick={onDelete}
                    aria-label={`${name} törlése`}
                    title='Törlés'
                >
                    <Trash2 strokeWidth={2} aria-hidden='true'/>
                </button>
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