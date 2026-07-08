import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import useSaveData from './useSaveData';


globalThis.fetch = vi.fn();

describe('useSaveData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct default states', () => {
        const { result } = renderHook(() => useSaveData());

        expect(result.current.isSaving).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should return true and not set error on successful request', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() => useSaveData());

        let success;
        await act(async () => {
            success = await result.current.saveData('/api/test', 'POST', { name: 'Máté' });
        });

        expect(success).toBe(true);
        expect(result.current.isSaving).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should call fetch with the correct parameters (url, method, headers, body)', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() => useSaveData());

        const payload = { name: 'Máté', age: 30 };

        await act(async () => {
            await result.current.saveData('/api/test', 'PUT', payload);
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/test', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
    });

    it('should return false and set specific error message when response is not ok', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        const { result } = renderHook(() => useSaveData());

        let success;
        await act(async () => {
            success = await result.current.saveData('/api/test', 'POST', {});
        });

        expect(success).toBe(false);
        expect(result.current.isSaving).toBe(false);
        expect(result.current.error).toBe('Error occurred while saving data.');
    });

    it('should return false and set error message on network failure', async () => {
        const errorMessage = 'Network Error: Failed to fetch';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useSaveData());

        let success;
        await act(async () => {
            success = await result.current.saveData('/api/test', 'POST', {});
        });

        expect(success).toBe(false);
        expect(result.current.isSaving).toBe(false);
        expect(result.current.error).toBe(errorMessage);
    });
});