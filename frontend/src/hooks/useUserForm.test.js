import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import useUserForm from './useUserForm';


describe('useUserForm hook', () => {
    const emptyFormData = {
        fullName: '', currentPassword: '',
        newPassword: '', newPasswordConfirm: ''
    };

    const mockUser = { fullName: 'Teszt Elek' };
    const validUser = { fullName: 'Valid Név' };

    it('should initialize with empty data if userData is not provided', () => {
        const { result } = renderHook(() => useUserForm(null));

        expect(result.current.formData).toEqual(emptyFormData);
        expect(result.current.formErrors).toEqual({});
    });

    it('should initialize with userData if provided', () => {
        const { result } = renderHook(() => useUserForm(mockUser));

        expect(result.current.formData.fullName).toBe('Teszt Elek');
        expect(result.current.formData.currentPassword).toBe('');
    });

    it('should fallback to empty string if userData is provided but fullName is missing', () => {

        const userWithoutName = { role: 'admin', email: 'test@patyodklima.hu' };

        const { result } = renderHook(() => useUserForm(userWithoutName));

        expect(result.current.formData.fullName).toBe('');
        expect(result.current.formData.currentPassword).toBe('');
    });

    it('should update formData and clear specific error on input change', () => {
        const { result } = renderHook(() => useUserForm(null));

        act(() => {
            result.current.validateForm();
        });
        expect(result.current.formErrors.fullName).toBe('A név megadása kötelező!');

        act(() => {
            result.current.handleInputChange('fullName', { target: { value: 'Kovács János' } });
        });

        expect(result.current.formData.fullName).toBe('Kovács János');
        expect(result.current.formErrors.fullName).toBeNull();
    });

    describe('validateForm', () => {
        it('should fail if fullName is missing', () => {
            const { result } = renderHook(() => useUserForm(null));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.fullName).toBe('A név megadása kötelező!');
        });

        it('should pass if only fullName is provided and valid', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.formErrors).toEqual({});
        });

        it('should fail if password change is initiated but currentPassword is missing', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('newPassword', { target: { value: 'new12345' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.currentPassword).toBe('A módosításhoz add meg a jelenlegi jelszavad!');
        });

        it('should fail if newPassword is missing during password change', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('currentPassword', { target: { value: 'old12345' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.newPassword).toBe('Az új jelszó megadása kötelező!');
        });

        it('should fail if newPassword is too short', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('currentPassword', { target: { value: 'oldpass' } });
                result.current.handleInputChange('newPassword', { target: { value: 'short' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.newPassword).toBe('Az új jelszónak legalább 8 karakternek kell lennie!');
        });

        it('should fail if newPasswordConfirm is missing', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('currentPassword', { target: { value: 'oldpass' } });
                result.current.handleInputChange('newPassword', { target: { value: 'validnewpass' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.newPasswordConfirm).toBe('A jelszó megerősítése kötelező!');
        });

        it('should fail if passwords do not match', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('currentPassword', { target: { value: 'oldpass' } });
                result.current.handleInputChange('newPassword', { target: { value: 'validnewpass' } });
                result.current.handleInputChange('newPasswordConfirm', { target: { value: 'differentpass' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.newPasswordConfirm).toBe('A két jelszó nem egyezik!');
        });

        it('should pass if all password fields are correctly filled', () => {
            const { result } = renderHook(() => useUserForm(validUser));

            act(() => {
                result.current.handleInputChange('currentPassword', { target: { value: 'oldpass' } });
                result.current.handleInputChange('newPassword', { target: { value: 'validnewpass' } });
                result.current.handleInputChange('newPasswordConfirm', { target: { value: 'validnewpass' } });
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.formErrors).toEqual({});
        });
    });
});