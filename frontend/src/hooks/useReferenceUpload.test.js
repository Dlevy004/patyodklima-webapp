import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import toast from 'react-hot-toast';

import useReferenceUpload from './useReferenceUpload';


vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() }
}));

describe('useReferenceUpload Hook', () => {
    beforeEach(() => {
        window.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
        window.URL.revokeObjectURL = vi.fn();
        window.fetch = vi.fn();
        vi.clearAllMocks();
    });

    it('should clear description error when handleDescriptionChange is called', async () => {
        const { result } = renderHook(() => useReferenceUpload());

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() });
        });
        expect(result.current.errors.description).toBeDefined();

        act(() => {
            result.current.handleDescriptionChange({ target: { value: 'Szöveg' } });
        });

        expect(result.current.description).toBe('Szöveg');
        expect(result.current.errors.description).toBeNull();
    });

    it('should set validation errors if file or description is missing', async () => {
        const { result } = renderHook(() => useReferenceUpload());
        const preventDefault = vi.fn();

        await act(async () => {
            await result.current.handleSubmit({ preventDefault });
        });

        expect(preventDefault).toHaveBeenCalled();
        expect(result.current.errors.file).toBe('Kérlek, válassz ki egy képet a feltöltéshez!');
        expect(result.current.errors.description).toBe('A leírás megadása kötelező!');
        expect(window.fetch).not.toHaveBeenCalled();
    });

    it('should upload successfully and reset form', async () => {
        const { result } = renderHook(() => useReferenceUpload());
        window.fetch.mockResolvedValueOnce({ ok: true });

        act(() => {
            result.current.handleFileSelect(new File([''], 'test.png'));
            result.current.handleDescriptionChange({ target: { value: 'Szép klíma' } });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() });
        });

        expect(window.fetch).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Referenciakép sikeresen feltöltve!');

        expect(result.current.description).toBe('');
        expect(result.current.previewUrl).toBeNull();
    });

    it('should handle JSON server error correctly', async () => {
        const { result } = renderHook(() => useReferenceUpload());

        window.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            text: vi.fn().mockResolvedValue(JSON.stringify({ message: 'Custom backend error' }))
        });

        act(() => {
            result.current.handleFileSelect(new File([''], 'test.png'));
            result.current.handleDescriptionChange({ target: { value: 'Szép klíma' } });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() });
        });

        expect(toast.error).toHaveBeenCalledWith('Error during upload: ', 'Custom backend error');
    });

    it('should log JSON parse error when server returns invalid JSON', async () => {
        const { result } = renderHook(() => useReferenceUpload());

        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        window.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: vi.fn().mockResolvedValue('This is not valid JSON')
        });

        act(() => {
            result.current.handleFileSelect(new File([''], 'test.png'));
            result.current.handleDescriptionChange({
                target: { value: 'Szép klíma' }
            });
        });

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn()
            });
        });

        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(undefined);

        expect(toast.error).toHaveBeenCalledWith(
            'Error during upload: ',
            'Server error (Status: 500)'
        );

        consoleSpy.mockRestore();
    });

    it('should handle selected file', () => {
        const { result } = renderHook(() => useReferenceUpload());

        const file = new File(['test'], 'test.png');

        act(() => {
            result.current.handleFileSelect(file);
        });

        expect(result.current.previewUrl).toBe('blob:fake-url');
    });

    it('should do nothing when no file is selected', () => {
        const { result } = renderHook(() => useReferenceUpload());

        act(() => {
            result.current.handleFileSelect(null);
        });

        expect(result.current.previewUrl).toBeNull();
        expect(result.current.description).toBe('');
        expect(result.current.errors).toEqual({});
    });
});