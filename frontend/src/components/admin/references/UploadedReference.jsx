import PropTypes from 'prop-types';

import './UploadedReference.css';

import ActionBtn from '../common/ActionBtn';


function UploadedReference({ title, imageUrl, isVisible = true, onDelete, onEdit, onToggleVisibility }) {
    return (
        <li className={`uploaded-reference ${isVisible ? '' : 'is-hidden'}`}>
            <img className='single-reference-img' src={imageUrl} alt={title} loading="lazy" />
            <div className='reference-actions'>
                {
                    isVisible
                        ? <ActionBtn type='visible' onClick={onToggleVisibility} />
                        : <ActionBtn type='invisible' onClick={onToggleVisibility} />
                }
                <ActionBtn type='edit' onClick={onEdit} />
                <ActionBtn type='delete' onClick={onDelete} />
            </div>
        </li>
    )
};

UploadedReference.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired
};

export default UploadedReference;