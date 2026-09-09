import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import useCompanyForm from './useCompanyForm';


describe('useCompanyForm hook', () => {
    const emptyFormData = {
        name: '', headquarters: '', registrationNumber: '',
        taxNumber: '', fGasNumber: '', phoneNumber: '', email: ''
    };

    const validCompany = {
        name: 'Pátyod Klíma Kft.',
        headquarters: '4765 Csenger, Példa utca 1.',
        registrationNumber: '12-34-567890',
        taxNumber: '12345678-2-15',
        fGasNumber: '1000000000000',
        phoneNumber: '+36301234567',
        email: 'info@patyodklima.hu'
    };

    it('should initialize with empty data if companyData is not provided', () => {
        const { result } = renderHook(() => useCompanyForm(null));

        expect(result.current.formData).toEqual(emptyFormData);
        expect(result.current.formErrors).toEqual({});
    });

    it('should initialize with companyData if provided', () => {
        const { result } = renderHook(() => useCompanyForm(validCompany));

        expect(result.current.formData).toEqual(validCompany);
    });

    it('should fallback to empty strings if companyData is an empty object', () => {
        const emptyCompanyData = {};

        const { result } = renderHook(() => useCompanyForm(emptyCompanyData));

        expect(result.current.formData).toEqual(emptyFormData);
    });

    it('should update formData and evaluate formErrors condition on input change', () => {
        const { result } = renderHook(() => useCompanyForm(null));

        act(() => {
            result.current.validateForm();
        });
        expect(result.current.formErrors.name).toBe('A név megadása kötelező!');

        act(() => {
            result.current.handleInputChange('name', { target: { value: 'Ú' } });
        });
        expect(result.current.formData.name).toBe('Ú');
        expect(result.current.formErrors.name).toBeNull();

        act(() => {
            result.current.handleInputChange('name', { target: { value: 'Új Név' } });
        });
        expect(result.current.formData.name).toBe('Új Név');
    });

    describe('validateForm', () => {
        it('should fail if any required field is missing or whitespace only', () => {
            const invalidData = {
                ...validCompany,
                name: '   ',
                taxNumber: ''
            };
            const { result } = renderHook(() => useCompanyForm(invalidData));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.name).toBe('A név megadása kötelező!');
            expect(result.current.formErrors.taxNumber).toBe('Az adószám megadása kötelező!');

            expect(result.current.formErrors.headquarters).toBeUndefined();
        });

        it('should fail if email is missing entirely', () => {
            const invalidEmailData = {
                ...validCompany,
                email: '   '
            };
            const { result } = renderHook(() => useCompanyForm(invalidEmailData));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.email).toBe('Az email cím megadása kötelező!');
        });

        it('should fail if email format is invalid', () => {
            const invalidEmailData = {
                ...validCompany,
                email: 'valami-hibas-email'
            };
            const { result } = renderHook(() => useCompanyForm(invalidEmailData));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.formErrors.email).toBe('Érvénytelen email formátum!');
        });

        it('should pass if all fields are correctly filled', () => {
            const { result } = renderHook(() => useCompanyForm(validCompany));

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.formErrors).toEqual({});
        });
    });
});