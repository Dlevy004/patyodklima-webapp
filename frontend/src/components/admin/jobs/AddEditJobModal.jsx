import PropTypes from 'prop-types';

import './AddEditJobModal.css';

import InputField from '../common/InputField';
import useJobForm, { JobType } from '../../../hooks/useJobForm';

const categoryOptions = [
    { value: JobType.SURVEY, label: 'Felmérés' },
    { value: JobType.INSTALLATION, label: 'Telepítés' },
    { value: JobType.MAINTENANCE, label: 'Karbantartás' },
    { value: JobType.CLEANING, label: 'Tisztítás' }
];

const leftFields = [
    { name: 'category', label: 'Munka típusa', type: 'select', placeholder: 'Válassz típust...', options: categoryOptions },
    { name: 'internal_notes', label: 'Szakmai jegyzetek', type: 'textarea' },
    { name: 'job_date', label: 'Dátum', type: 'date' }
];

const rightFields = [
    { name: 'ac_unit', label: 'Készülék típusa', type: 'text' },
    { name: 'general_notes', label: 'Megjegyzés', type: 'textarea' },
    { name: 'labor_fee', label: 'Munkadíj', type: 'text' },
    { name: 'total_amount', label: 'Teljes összeg', type: 'text' },
];


function AddEditJobModal({ onClose, onSave, jobData, clientsList = [] }) {
    const {
        formData, formErrors,
        handleInputChange, validateForm
    } = useJobForm(jobData);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const clientOptions = clientsList.map(client => ({
        value: client.id,
        label: `${client.full_name} (${client.city})`
    }));

    return (
        <form
            className='job-data-modal'
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="modal-title"
        >
            <div className='title-bg'>
                <h1 id="modal-title">{jobData ? 'Munka adatainak módosítása' : 'Új munka bejegyzése'}</h1>
            </div>

            <div className='job-datas-wrapper'>
                <div className='job-datas-top'>
                    <h3>Ügyfél adatok</h3>
                    <InputField
                        label='Ügyfél kiválasztása'
                        type='select'
                        placeholder='Nincs kiválasztott ügyfél'
                        options={clientOptions}
                        value={formData.client_id}
                        onChange={(e) => handleInputChange('client_id', e)}
                        error={formErrors.client_id}
                    />
                </div>

                <div className='job-datas-bottom'>
                    <h3>Munka adatok</h3>
                    <div className='wrapper-cols'>
                        <div className='wrapper-left'>
                            {leftFields.map((field) => (
                                <InputField
                                    key={field.name}
                                    label={field.label}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    pattern={field.pattern}
                                    options={field.options}
                                    value={formData[field.name]}
                                    onChange={(event) => handleInputChange(field.name, event)}
                                    error={formErrors[field.name]}
                                />
                            ))}
                        </div>

                        <div className='wrapper-right'>
                            {rightFields.map((field) => (
                                <InputField
                                    key={field.name}
                                    label={field.label}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    pattern={field.pattern}
                                    options={field.options}
                                    value={formData[field.name]}
                                    onChange={(event) => handleInputChange(field.name, event)}
                                    error={formErrors[field.name]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className='modal-buttons'>
                <button type='button' className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button type='submit' className='modal-save-btn'>Mentés</button>
            </div>
        </form>
    )
}

AddEditJobModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    jobData: PropTypes.object,
    clientsList: PropTypes.array
};

export default AddEditJobModal;