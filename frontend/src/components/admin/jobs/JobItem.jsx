import PropTypes from 'prop-types'

import './JobItem.css'

import ActionBtn from '../common/ActionBtn'


function JobItem({ client_name, category, unit, date, isCompleted, onToggleStatus, onDelete, onEdit }) {

    const handleActionClick = (e, actionFunction) => {
        e.stopPropagation();
        actionFunction();
    };

    return (
        <li className={`job-item ${isCompleted ? 'completed' : ''}`} onClick={onEdit}>
            <div className='job-details'>
                <p className='job-name'>{client_name}</p>
                <p className='job-category'>{category}</p>
                <p className='ac_unit'>{unit}</p>
                <p className='job-date'>{date}</p>
            </div>
            <div className='actions'>
                {
                    isCompleted
                    ? <ActionBtn
                        type='completed'
                        onClick={(e) => handleActionClick(e, onToggleStatus)}
                        ariaLabel={`${client_name} munkájának megjelölése folyamatban lévőként`}
                      />
                    : <ActionBtn
                        type='pending'
                        onClick={(e) => handleActionClick(e, onToggleStatus)}
                        ariaLabel={`${client_name} munkájának megjelölése teljesítettnek`}
                      />
                }
                <ActionBtn
                    type='edit'
                    onClick={(e) => handleActionClick(e, onEdit)}
                    ariaLabel={`${client_name} munkájának szerkesztése`}
                />
                <ActionBtn
                    type='delete'
                    onClick={(e) => handleActionClick(e, onDelete)}
                    ariaLabel={`${client_name} munkájának törlése`}
                />
            </div>
        </li>
    )
}

JobItem.propTypes = {
    client_name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    onToggleStatus: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
}

export default JobItem