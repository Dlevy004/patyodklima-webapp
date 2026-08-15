import PropTypes from 'prop-types';

import './UploadedReference.css';

import ActionBtn from '../common/ActionBtn';


function UploadedReference({ title, imageUrl, isVisible = true }) {
    return (
        <li className='uploaded-reference'>
            <img className='single-reference-img' src={imageUrl} alt={title} loading="lazy" />
            <div className='reference-actions'>
                {
                    isVisible
                        ? <ActionBtn type='visible' onClick={() => {}} />
                        : <ActionBtn type='invisible' onClick={() => {}} />
                }
                <ActionBtn type='edit' onClick={() => {}} />
                <ActionBtn type='delete' onClick={() => {}} />
            </div>
        </li>
    )
};

UploadedReference.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    isVisible: PropTypes.bool
};

export default UploadedReference;