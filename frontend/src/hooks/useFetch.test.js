import { renderHook, waitFor } from '@testing-library/react'
import useFetch from './useFetch'
import { describe, it, expect, vi, beforeEach } from 'vitest'

globalThis.fetch = vi.fn();

describe('useFetch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return data on success', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([{ id: '1', full_name: 'Minta Máté' }])
        });

        const { result } = renderHook(() => useFetch('/api/clients'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([{ id: '1', full_name: 'Minta Máté' }]);
            expect(result.current.error).toBeNull();
        });
    });

    it('should return error on failure', async () => {
        fetch.mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useFetch('/api/clients'));

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to retrieve data from the server.');
            expect(result.current.data).toBeNull();
        });
    });

    it('should reset state when url changes', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([])
        });

        const { result, rerender } = renderHook(({ url }) => useFetch(url), {
            initialProps: { url: '/api/clients' }
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        rerender({ url: '/api/jobs' });
        expect(result.current.isLoading).toBe(true);
    });
});