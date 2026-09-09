import PropTypes from 'prop-types';
import toast from "react-hot-toast";

import './EditCompanyDataModal.css';

import useCompanyForm from '../../../hooks/useCompanyForm';
import InputField from '../common/InputField';

const leftFields = [
    { name: 'name', label: 'Cég neve', type: 'text' },
    { name: 'headquarters', label: 'Székhely', type: 'text' },
    { name: 'registrationNumber', label: 'Nyilvántartási szám', type: 'text' },
    { name: 'taxNumber', label: 'Adószám', type: 'text' },
];
const rightFields = [
    { name: 'fGasNumber', label: 'F-gáz szám', type: 'text' },
    { name: 'phoneNumber', label: 'Telefonszám', type: 'text' },
    { name: 'email', label: 'Email cím', type: 'email' },
];


function EditCompanyDataModal({ onClose, onSave, companyData }) {
    const {
        formData, formErrors,
        handleInputChange, validateForm
    } = useCompanyForm(companyData);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            await onSave(formData);
        } else {
            toast.error('Kérjük, javítsa a hibákat a mentéshez!');
        }
    };

    return (
        <form
            className='company-data-modal'
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className='title-bg'>
                <h1 id="modal-title">Cég adatok módosítása</h1>
            </div>
            <div className='company-datas-wrapper'>
                <div className='company-wrapper-left'>
                    {leftFields.map((field) => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(field.name, event)}
                            error={formErrors[field.name]}
                        />
                    ))}
                </div>
                <div className='company-wrapper-right'>
                    {rightFields.map((field) => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(field.name, event)}
                            error={formErrors[field.name]}
                        />
                    ))}
                </div>
            </div>
            <div className='modal-buttons'>
                <button type='button' className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button type='submit' className='modal-save-btn'>Mentés</button>
            </div>
        </form>
    )
}

EditCompanyDataModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    companyData: PropTypes.object
};

export default EditCompanyDataModal;