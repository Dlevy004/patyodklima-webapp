import PropTypes from 'prop-types';

import './AddEditClientModal.css';

import InputField from '../common/InputField';
import Slider from '../common/Slider';
import useClientForm from '../../../hooks/useClientForm';

const leftFields = [
    { name: 'full_name', label: 'Ügyfél neve', type: 'text' },
    { name: 'phone', label: 'Ügyfél telefonszáma', type: 'tel' },
    { name: 'zip_code', label: 'Ügyfél címe', type: 'text', placeholder: 'Irányítószám', pattern: '[0-9]{4}' },
    { name: 'city', type: 'text', placeholder: 'Város' },
    { name: 'street_address', type: 'text', placeholder: 'Utca, házszám' }
];


function AddEditClientModal({ onClose, onSave, clientData }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({ ...formData, type: clientType });
        }
    };

    const {
        clientType, setClientType,
        formData, formErrors,
        handleInputChange, validateForm,
        ClientType
    } = useClientForm(clientData);

    const sliderCondition = clientType === ClientType.COMPANY ? 'slide-right' : '';
    const individualCondition = clientType === ClientType.INDIVIDUAL ? 'active' : '';
    const companyCondition = clientType === ClientType.COMPANY ? 'active' : '';

    return (
        <form
            className='client-data-modal'
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="modal-title"
        >
            <div className='title-bg'>
                <h1 id="modal-title">{clientData ? 'Ügyfél adatainak módosítása' : 'Új ügyfél bejegyzése'}</h1>
            </div>
            <div className='client-datas-wrapper'>
                <div className='wrapper-left'>
                    {leftFields.map((field) => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            pattern={field.pattern}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(field.name, event)}
                            error={formErrors[field.name]}
                        />
                    ))}
                </div>
                <div className='wrapper-right'>
                    <Slider
                        title={'Ügyfél típusa'}
                        condition={sliderCondition}
                        button1ClassName={individualCondition}
                        onButton1Click={() => setClientType(ClientType.INDIVIDUAL)}
                        button1Title={'Magánszemély'}
                        button2ClassName={companyCondition}
                        onButton2Click={() => setClientType(ClientType.COMPANY)}
                        button2Title={'Cég'}
                    />
                    <InputField
                        label={'Ügyfél email címe (opcionális)'}
                        type={'email'}
                        value={formData?.email}
                        onChange={(event) => handleInputChange('email', event)}
                        error={formErrors.email}
                    />
                    <InputField
                        label={'Megjegyzés (opcionális)'}
                        type={'textarea'}
                        value={formData?.notes}
                        onChange={(event) => handleInputChange('notes', event)}
                    />
                </div>
            </div>
            <div className='modal-buttons'>
                <button type='button' className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button type='submit' className='modal-save-btn'>Mentés</button>
            </div>
        </form>
    )
}

AddEditClientModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    clientData: PropTypes.object
};

export default AddEditClientModal;