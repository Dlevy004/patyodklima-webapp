import { useState, useEffect } from 'react'

import PropTypes from 'prop-types';

import './EditReferenceModal.css'

import InputField from '@/components/admin/common/InputField';


function EditReferenceModal({ onClose, onSave, referenceData }) {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (referenceData) {
            setDescription(referenceData.description || '');
        }
    }, [referenceData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...referenceData,
            description: description
        });
    };

    return (
        <form className='edit-modal' aria-labelledby="edit-modal-title" onSubmit={handleSubmit}>
            <div className='title-bg'>
                <h1 id="edit-modal-title">Referenciakép szerkesztése</h1>
            </div>
            <div className='edit-reference-content'>
                <img src={referenceData?.image_url} alt="Szerkesztendő referenciakép" loading="lazy"/>
                <InputField
                    label='Leírás szerkesztése'
                    type='textarea'
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div className='modal-buttons'>
                <button type='button' className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button type='submit' className='modal-save-btn'>Mentés</button>
            </div>
        </form>
    )
}

EditReferenceModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
}

export default EditReferenceModal;