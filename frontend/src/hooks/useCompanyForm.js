import { useState, useEffect } from 'react';

const emptyFormData = {
    name: '',
    headquarters: '',
    registrationNumber: '',
    taxNumber: '',
    fGasNumber: '',
    phoneNumber: '',
    email: ''
};


function useCompanyForm(companyData) {
    const [formData, setFormData] = useState(emptyFormData);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (companyData) {
            setFormData({
                name: companyData.name || '',
                headquarters: companyData.headquarters || '',
                registrationNumber: companyData.registrationNumber || '',
                taxNumber: companyData.taxNumber || '',
                fGasNumber: companyData.fGasNumber || '',
                phoneNumber: companyData.phoneNumber || '',
                email: companyData.email || ''
            });
        } else {
            setFormData(emptyFormData);
        }
        setFormErrors({});
    }, [companyData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name?.trim()) errors.name = 'A név megadása kötelező!';
        if (!formData.headquarters?.trim()) errors.headquarters = 'A székhely megadása kötelező!';
        if (!formData.registrationNumber?.trim()) errors.registrationNumber = 'A nyilvántartási szám megadása kötelező!';
        if (!formData.taxNumber?.trim()) errors.taxNumber = 'Az adószám megadása kötelező!';
        if (!formData.fGasNumber?.trim()) errors.fGasNumber = 'Az F-gáz szám megadása kötelező!';
        if (!formData.phoneNumber?.trim()) errors.phoneNumber = 'A telefonszám megadása kötelező!';

        if (!formData.email?.trim()) {
            errors.email = 'Az email cím megadása kötelező!';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Érvénytelen email formátum!';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        formData, formErrors,
        handleInputChange, validateForm
    };
}

export default useCompanyForm;