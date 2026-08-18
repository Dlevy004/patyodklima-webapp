import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';

import './ChangePasswordModal.css';


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
        <div className="change-password-overlay" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
            <div className="change-password-modal">
                <h2 id="change-password-title">Jelszó módosítása</h2>
                <p className="change-password-description">
                    Biztonsági okokból az első bejelentkezés után új jelszót kell beállítania.
                </p>

                <form className="change-password-form" onSubmit={handleSubmit}>
                    <label htmlFor="current-password">Jelenlegi jelszó</label>
                    <div className="password-input-wrapper">
                        <input
                            id="current-password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={handleChange('currentPassword')}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            aria-label={showCurrentPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <label htmlFor="new-password">Új jelszó</label>
                    <div className="password-input-wrapper">
                        <input
                            id="new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleChange('newPassword')}
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label={showNewPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <label htmlFor="confirm-password">Új jelszó megerősítése</label>
                    <input
                        id="confirm-password"
                        type="password"
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
        </div>
    );
}

ChangePasswordModal.propTypes = {
    onSuccess: PropTypes.func,
};

export default ChangePasswordModal;