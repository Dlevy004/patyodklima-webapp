import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import './AddEditClientModal.css';

import InputField from '../common/InputField';
import Slider from '../common/Slider';


const ClientType = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company'
};

function AddEditClientModal({ onClose, onSave, clientData }) {
    const [clientType, setClientType] = useState(ClientType.INDIVIDUAL);
    const sliderCondition = clientType === ClientType.COMPANY ? 'slide-right' : '';
    const individualCondition = clientType === ClientType.INDIVIDUAL ? 'active' : '';
    const companyCondition = clientType === ClientType.COMPANY ? 'active' : '';

    const [formData, setFormData] = useState({
        full_name: '', phone: '', zip_code: '', city: '',
        street_address: '', email: '', notes: ''
    });

    useEffect(() => {
        if (clientData) {
            setClientType(clientData.type || ClientType.INDIVIDUAL);
            setFormData({
                full_name: clientData.full_name || '',
                phone: clientData.phone || '',
                zip_code: clientData.zip_code || '',
                city: clientData.city || '',
                street_address: clientData.street_address || '',
                email: clientData.email || '',
                notes: clientData.notes || ''
            });
        } else {
            setClientType(ClientType.INDIVIDUAL);
            setFormData({
                full_name: '', phone: '', zip_code: '', city: '',
                street_address: '', email: '', notes: ''
            });
        }
        setFormErrors({});
    }, [clientData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSave({ ...formData, type: clientType });
        }
    };

    const [formErrors, setFormErrors] = useState({});
    const validateForm = () => {
        const errors = {};

        if (!formData.full_name.trim()) {
            errors.full_name = 'Az ügyfél nevének megadása kötelező!';
        }

        const phoneRegex = /^(\+36|06)\s?\d{2}\s?\d{3}\s?\d{4}$/;
        if (!formData.phone.trim()) {
            errors.phone = 'A telefonszám megadása kötelező!';
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Helytelen formátum (pl: +36 30 123 4567)';
        }

        const zipRegex = /^[0-9]{4}$/;
        if (formData.zip_code && !zipRegex.test(formData.zip_code)) {
            errors.zip_code = 'Az irányítószám 4 számjegyből állhat!';
        }

        if (!formData.city.trim()) {
            errors.city = 'Az város nevének megadása kötelező!';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.email = 'Helytelen email formátum!';
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    return (
        <form className='client-data-modal' onSubmit={handleSubmit} noValidate>
            <div className='title-bg'>
                <h1>{clientData ? 'Ügyfél adatainak módosítása' : 'Új ügyfél bejegyzése'}</h1>
            </div>
            <div className='client-datas-wrapper'>
                <div className='wrapper-left'>
                    <InputField
                        label={'Ügyfél neve'}
                        type={'text'}
                        value={formData?.full_name}
                        onChange={(event) => handleInputChange('full_name', event)}
                        error={formErrors.full_name}
                    />
                    <InputField
                        label={'Ügyfél telefonszáma'}
                        type={'tel'}
                        value={formData?.phone}
                        onChange={(event) => handleInputChange('phone', event)}
                        error={formErrors.phone}
                    />
                    <InputField
                        label={'Ügyfél címe'}
                        type={'pattern'}
                        value={formData?.zip_code}
                        onChange={(event) => handleInputChange('zip_code', event)}
                        placeholder={'Irányítószám'}
                        pattern={'[0-9]{4}'}
                        error={formErrors.zip_code}
                    />
                    <InputField
                        type={'text'}
                        value={formData?.city}
                        onChange={(event) => handleInputChange('city', event)}
                        placeholder={'Város'}
                        error={formErrors.city}
                    />
                    <InputField
                        type={'text'}
                        value={formData?.street_address}
                        onChange={(event) => handleInputChange('street_address', event)}
                        placeholder={'Utca, házszám'}
                        error={formErrors.street_address}
                    />
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