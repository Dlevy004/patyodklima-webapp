import PropTypes from 'prop-types'

import { Plus } from 'lucide-react'

import './TableHeader.css'


function TableHeader({ onAddClick }) {
    return (
        <div className='table-header'>
            <button className='add-btn' onClick={onAddClick}>
                <Plus />
            </button>
        </div>
    )
}

TableHeader.propTypes = {
    onAddClick: PropTypes.func.isRequired
}

export default TableHeader