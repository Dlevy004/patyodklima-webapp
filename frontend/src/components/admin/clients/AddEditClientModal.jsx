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
    }, [clientData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    return (
        <div className='client-data-modal'>
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
                    />
                    <InputField
                        label={'Ügyfél telefonszáma'}
                        type={'tel'}
                        value={formData?.phone}
                        onChange={(event) => handleInputChange('phone', event)}
                        pattern={'^(\\+36|06)\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}$'}
                    />
                    <InputField
                        label={'Ügyfél címe'}
                        type={'pattern'}
                        value={formData?.zip_code}
                        onChange={(event) => handleInputChange('zip_code', event)}
                        placeholder={'Irányítószám'}
                        pattern={'[0-9]{4}'}
                    />
                    <InputField
                        type={'text'}
                        value={formData?.city}
                        onChange={(event) => handleInputChange('city', event)}
                        placeholder={'Város'}
                        pattern={'[a-zA-Z]{2,}'}
                    />
                    <InputField
                        type={'text'}
                        value={formData?.street_address}
                        onChange={(event) => handleInputChange('street_address', event)}
                        placeholder={'Utca, házszám'}
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
                        pattern={'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'}
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
                <button className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button className='modal-save-btn' onClick={onSave}>Mentés</button>
            </div>
        </div>
    )
}

AddEditClientModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    clientData: PropTypes.object
};

export default AddEditClientModal;