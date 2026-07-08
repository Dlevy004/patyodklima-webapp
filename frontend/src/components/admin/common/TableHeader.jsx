import PropTypes from 'prop-types'

import './TableHeader.css'

import AddIcon from '../../icons/AddIcon'


function TableHeader({ onAddClick }) {
    return (
        <div className='table-header'>
            <button className='add-btn' onClick={onAddClick}>
                <AddIcon />
            </button>
        </div>
    )
}

TableHeader.propTypes = {
    onAddClick: PropTypes.func.isRequired
}

export default TableHeader