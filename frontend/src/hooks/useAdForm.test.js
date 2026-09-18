import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import useAdForm, { emptyAdFormData } from './useAdForm';


describe('useAdForm', () => {
    it('should initialize with empty data', () => {
        const { result } = renderHook(() => useAdForm());

        expect(result.current.formData).toEqual(emptyAdFormData);
        expect(result.current.formErrors).toEqual({});
    });

    it('should update a field and clear its error', () => {
        const { result } = renderHook(() => useAdForm());

        act(() => {
            result.current.validateForm();
        });
        expect(result.current.formErrors.headline).toBeTruthy();

        act(() => {
            result.current.handleInputChange('headline', 'Nyári akció');
        });

        expect(result.current.formData.headline).toBe('Nyári akció');
        expect(result.current.formErrors.headline).toBeNull();
    });

    it('should validate required fields and numeric price', () => {
        const { result } = renderHook(() => useAdForm());

        act(() => {
            expect(result.current.validateForm()).toBe(false);
        });

        expect(result.current.formErrors).toMatchObject({
            headline: 'A főcím megadása kötelező!',
            acUnitName: 'A készülék típusának megadása kötelező!',
            details: 'A részletek megadása kötelező!',
            price: 'Az ár megadása kötelező!',
        });

        act(() => {
            result.current.handleInputChange('headline', 'Nyári akció');
            result.current.handleInputChange('acUnitName', 'ANDE Xtreme');
            result.current.handleInputChange('details', 'Wi-Fi');
            result.current.handleInputChange('price', '-10');
        });

        act(() => {
            expect(result.current.validateForm()).toBe(false);
        });
        expect(result.current.formErrors.price).toBe('Az ár csak pozitív szám lehet!');

        act(() => {
            result.current.handleInputChange('price', '250000');
        });
        act(() => {
            expect(result.current.validateForm()).toBe(true);
        });
        expect(result.current.formErrors).toEqual({});
    });

    it('should reset the form', () => {
        const { result } = renderHook(() => useAdForm());

        act(() => {
            result.current.handleInputChange('headline', 'Teszt');
            result.current.validateForm();
            result.current.resetForm();
        });

        expect(result.current.formData).toEqual(emptyAdFormData);
        expect(result.current.formErrors).toEqual({});
    });
});