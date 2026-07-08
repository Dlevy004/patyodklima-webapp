import {  renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import useClientForm from './useClientForm'
import { act } from 'react';

describe('useClientForm', () => {
    it('should set error when the full name field is empty', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.full_name).toBe('Az ügyfél nevének megadása kötelező!');
    });

    it('should set error when the city field is empty', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.city).toBe('A város nevének megadása kötelező!');
    });

    it('should set error when the phone number field is empty', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.phone).toBe('A telefonszám megadása kötelező!');
    });

    it('should set error when phone number format is incorrect', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.handleInputChange('phone', { target: { value: '06 20 1234 567' } });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.phone).toBe('Helytelen formátum (pl: +36 30 123 4567)');
    });

    it('should set error when zip code format is incorrect', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.handleInputChange('zip_code', { target: { value: '12345' } });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.zip_code).toBe('Az irányítószám 4 számjegyből állhat!');
    });

    it('should set error when email format is incorrect', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.handleInputChange('email', { target: { value: 'test' } });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.email).toBe('Helytelen email formátum!');
    });

    it('clears the validation error when the user edits the field after a failed submit', () => {
        const { result } = renderHook(() => useClientForm(null));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.full_name).toBe('Az ügyfél nevének megadása kötelező!');

        act(() => {
            result.current.handleInputChange('full_name', { target: { value: 'Test Name' } });
        });

        expect(result.current.formErrors.full_name).toBeFalsy();
    });
});