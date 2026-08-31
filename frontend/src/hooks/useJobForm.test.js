import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useJobForm, { JobType } from './useJobForm';

describe('useJobForm', () => {
    const emptyFormData = {
        client_id: '', category: '', job_date: '', internal_notes: '',
        general_notes: '', labor_fee: '', total_amount: '', ac_unit: ''
    };

    it('should initialize with empty data if no jobData is provided', () => {
        const { result } = renderHook(() => useJobForm());

        expect(result.current.formData).toEqual(emptyFormData);
        expect(result.current.formErrors).toEqual({});
    });

    it('should initialize with mapped jobData if provided', () => {
        const mockJobData = {
            client_id: 'client-1',
            category: JobType.INSTALLATION,
            job_date: '2026-08-30T10:00:00.000Z',
            internal_notes: 'Belső',
            general_notes: 'Általános',
            labor_fee: 50000,
            total_amount: 350000,
            ac_unit: 'Midea Xtreme'
        };

        const { result } = renderHook(() => useJobForm(mockJobData));

        expect(result.current.formData).toEqual({
            client_id: 'client-1',
            category: 'installation',
            job_date: '2026-08-30',
            internal_notes: 'Belső',
            general_notes: 'Általános',
            labor_fee: 50000,
            total_amount: 350000,
            ac_unit: 'Midea Xtreme'
        });
    });

    it('should fallback to empty strings for missing fields in jobData', () => {
        const partialJobData = {
            client_id: 'client-1'
        };

        const { result } = renderHook(() => useJobForm(partialJobData));

        expect(result.current.formData).toEqual({
            ...emptyFormData,
            client_id: 'client-1'
        });
    });

    it('should update formData when handleInputChange is called', () => {
        const { result } = renderHook(() => useJobForm());

        act(() => {
            result.current.handleInputChange('category', { target: { value: 'maintenance' } });
        });

        expect(result.current.formData.category).toBe('maintenance');
    });

    it('should clear specific field error when handleInputChange is called', () => {
        const { result } = renderHook(() => useJobForm());

        act(() => {
            result.current.validateForm();
        });
        expect(result.current.formErrors.category).toBe('A munka típusának megadása kötelező!');

        act(() => {
            result.current.handleInputChange('category', { target: { value: 'survey' } });
        });

        expect(result.current.formErrors.category).toBeNull();
    });

    it('should validate form successfully with correct data', () => {
        const mockJobData = {
            client_id: 'c-1', category: 'survey', job_date: '2026-09-01',
            ac_unit: 'AUX', labor_fee: 30000, total_amount: 50000
        };
        const { result } = renderHook(() => useJobForm(mockJobData));

        let isValid;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(true);
        expect(result.current.formErrors).toEqual({});
    });

    it('should fail validation and set errors for missing required fields', () => {
        const { result } = renderHook(() => useJobForm());

        let isValid;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(false);
        expect(result.current.formErrors.client_id).toBe('Az ügyfél kiválasztása kötelező!');
        expect(result.current.formErrors.category).toBe('A munka típusának megadása kötelező!');
        expect(result.current.formErrors.job_date).toBe('A dátum megadása kötelező!');
        expect(result.current.formErrors.ac_unit).toBe('A készülék típusának megadása kötelező!');
    });

    it('should fail validation if ac_unit is only whitespace', () => {
        const whitespaceJobData = { ac_unit: '   ' };
        const { result } = renderHook(() => useJobForm(whitespaceJobData));

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.ac_unit).toBe('A készülék típusának megadása kötelező!');
    });

    it('should fail validation if labor_fee or total_amount is not a valid number', () => {
        const { result } = renderHook(() => useJobForm());

        act(() => {
            result.current.handleInputChange('labor_fee', { target: { value: 'abc' } });
            result.current.handleInputChange('total_amount', { target: { value: 'xyz' } });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.formErrors.labor_fee).toBe('A munkadíj csak szám lehet!');
        expect(result.current.formErrors.total_amount).toBe('A teljes összeg csak szám lehet!');
    });
});