import { useState, useEffect } from 'react';


const ClientType = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company'
};

const emptyFormData = {
    full_name: '', phone: '', zip_code: '', city: '',
    street_address: '', email: '', notes: ''
}

function useClientForm(clientData) {
    const [clientType, setClientType] = useState(ClientType.INDIVIDUAL);
    const [formData, setFormData] = useState(emptyFormData);
    const [formErrors, setFormErrors] = useState({});

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
            setFormData(emptyFormData);
        }
        setFormErrors({});
    }, [clientData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

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
            errors.city = 'A város nevének megadása kötelező!';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.email = 'Helytelen email formátum!';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        clientType, setClientType,
        formData, formErrors,
        handleInputChange, validateForm,
        ClientType
    };
}

export default useClientForm;