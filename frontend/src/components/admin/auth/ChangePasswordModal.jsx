import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

import './ChangePasswordModal.css';

import { useAuth } from '../../../context/AuthContext';
import InputField from '../common/InputField'


function ChangePasswordModal({ onSuccess }) {
    const { changePassword } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.newPassword.length < 8) {
            setError('Az új jelszónak legalább 8 karakter hosszúnak kell lennie.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Az új jelszavak nem egyeznek.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            onSuccess?.();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="change-password-modal">
            <h2 id="change-password-title">Jelszó módosítása</h2>
            <p className="change-password-description">
                Biztonsági okokból az első bejelentkezés után új jelszót kell beállítania.
            </p>

            <form className="change-password-form" onSubmit={handleSubmit} noValidate>
                <InputField
                    id="current-password"
                    label='Jelenlegi jelszó'
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange('currentPassword')}
                    required
                    autoComplete="current-password"
                />
                <InputField
                    id="new-password"
                    label='Új jelszó'
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange('newPassword')}
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
                <InputField
                    id="confirm-password"
                    label='Új jelszó megerősítése'
                    type='password'
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    required
                    minLength={8}
                    autoComplete="new-password"
                />

                {error && <p className="change-password-error">{error}</p>}
                <button type="submit" className="change-password-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Mentés...' : 'Jelszó frissítése'}
                </button>
            </form>
        </div>
    );
}

ChangePasswordModal.propTypes = {
    onSuccess: PropTypes.func,
};

export default ChangePasswordModal;