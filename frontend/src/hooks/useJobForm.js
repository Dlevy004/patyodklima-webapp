import { useState, useEffect } from 'react';

export const JobType = {
    SURVEY: 'survey',
    INSTALLATION: 'installation',
    MAINTENANCE: 'maintenance',
    CLEANING: 'cleaning'
}

const emptyFormData = {
    client_id: '', category: '', job_date: '', internal_notes: '',
    general_notes: '', labor_fee: '', total_amount: '', ac_unit: ''
}


function useJobForm(jobData) {
    const [formData, setFormData] = useState(emptyFormData);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (jobData) {
            setFormData({
                client_id: jobData.client_id || '',
                category: jobData.category || '',
                job_date: jobData.job_date ? jobData.job_date.split('T')[0] : '',
                internal_notes: jobData.internal_notes || '',
                general_notes: jobData.general_notes || '',
                labor_fee: jobData.labor_fee || '',
                total_amount: jobData.total_amount || '',
                ac_unit: jobData.ac_units?.[0]?.model_name || ''
            });
        } else {
            setFormData(emptyFormData);
        }
        setFormErrors({});
    }, [jobData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.client_id) errors.client_id = 'Az ügyfél kiválasztása kötelező!';
        if (!formData.category) errors.category = 'A munka típusának megadása kötelező!';
        if (!formData.job_date) errors.job_date = 'A dátum megadása kötelező!';

        if (formData.labor_fee && Number.isNaN(formData.labor_fee)) {
            errors.labor_fee = 'A munkadíj csak szám lehet!';
        }
        if (formData.total_amount && Number.isNaN(formData.total_amount)) {
            errors.total_amount = 'A teljes összeg csak szám lehet!';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        formData, formErrors,
        handleInputChange, validateForm
    };
}

export default useJobForm;