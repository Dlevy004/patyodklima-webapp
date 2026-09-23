import { useState } from 'react';

export const emptyMarketingFormData = {
    headline: '',
    acUnitName: '',
    details: '',
    price: '',
    showLogo: true,
    showPhone: true,
};

function useMarketingForm() {
    const [formData, setFormData] = useState(emptyMarketingFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const resetForm = () => {
        setFormData(emptyMarketingFormData);
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.headline.trim()) {
            errors.headline = 'A főcím megadása kötelező!';
        }

        if (!formData.acUnitName.trim()) {
            errors.acUnitName = 'A készülék típusának megadása kötelező!';
        }

        if (!formData.details.trim()) {
            errors.details = 'A részletek megadása kötelező!';
        }

        if (formData.price === '' || formData.price === null || formData.price === undefined) {
            errors.price = 'Az ár megadása kötelező!';
        } else if (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            errors.price = 'Az ár csak pozitív szám lehet!';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        formData,
        formErrors,
        handleInputChange,
        resetForm,
        validateForm,
    };
}

export default useMarketingForm;