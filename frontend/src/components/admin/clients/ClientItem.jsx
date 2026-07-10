import PropTypes from 'prop-types'

import { SquarePen, Trash2 } from 'lucide-react'

import './ClientItem.css'


function ClientItem({ name, city, phone, onDelete, onEdit }) {
    return (
        <div className='client-item'>
            <div className='client-details'>
                <p className='client-name'>{name}</p>
                <p className='client-city'>{city}</p>
                <p className='client-phone'>{phone}</p>
            </div>
            <div className='actions'>
                <button className='edit-btn' onClick={onEdit}>
                    <SquarePen strokeWidth={2}/>
                </button>
                <button className='delete-btn' onClick={onDelete}>
                    <Trash2 strokeWidth={2}/>
                </button>
            </div>
        </div>
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