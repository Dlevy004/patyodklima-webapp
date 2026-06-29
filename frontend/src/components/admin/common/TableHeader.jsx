import './TableHeader.css'
import AddIcon from '../../icons/AddIcon'

function TableHeader() {
    return (
        <div className='table-header'>
            <button className='add-btn'>
                <AddIcon />
            </button>
        </div>
    )
}

export default TableHeader