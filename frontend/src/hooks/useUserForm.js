import { useState, useEffect } from 'react';

const emptyFormData = {
    fullName: '', currentPassword: '',
    newPassword: '', newPasswordConfirm: ''
}


function useUserForm(userData) {
    const [formData, setFormData] = useState(emptyFormData);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                currentPassword: '',
                newPassword: '',
                newPasswordConfirm: ''
            });
        } else {
            setFormData(emptyFormData);
        }
        setFormErrors({});
    }, [userData]);

    const handleInputChange = (field, event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.fullName?.trim()) errors.fullName = 'A név megadása kötelező!';

        const isPasswordChanging = formData.currentPassword || formData.newPassword || formData.newPasswordConfirm;

        if (isPasswordChanging) {
            if (!formData.currentPassword) {
                errors.currentPassword = 'A módosításhoz add meg a jelenlegi jelszavad!';
            }
            if (!formData.newPassword) {
                errors.newPassword = 'Az új jelszó megadása kötelező!';
            } else if (formData.newPassword.length < 8) {
                errors.newPassword = 'Az új jelszónak legalább 8 karakternek kell lennie!';
            }

            if (!formData.newPasswordConfirm) {
                errors.newPasswordConfirm = 'A jelszó megerősítése kötelező!';
            } else if (formData.newPassword !== formData.newPasswordConfirm) {
                errors.newPasswordConfirm = 'A két jelszó nem egyezik!';
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

export default useUserForm;