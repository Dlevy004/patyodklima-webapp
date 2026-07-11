import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import toast from 'react-hot-toast';

import useDeleteData from './useDeleteData';


globalThis.fetch = vi.fn();

describe('useDeleteData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    vi.mock('react-hot-toast');

    it('should return true on successful deletion', async () => {
        fetch.mockResolvedValue({ ok: true });

        const { result } = renderHook(() => useDeleteData());

        let success;
        await act(async () => {
            success = await result.current.deleteData('/api/clients/1');
        });

        expect(success).toBe(true);
        expect(result.current.isDeleting).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should render hot toast message on successful deletion', async () => {
        fetch.mockResolvedValue({ ok: true });

        const { result } = renderHook(() => useDeleteData());

        let success;
        await act(async () => {
            success = await result.current.deleteData('/api/clients/1');
        });

        expect(success).toBe(true);
        expect(toast.success).toHaveBeenCalledWith('Sikeresen törölve!');
    });

    it('should return false and set error on failure', async () => {
        fetch.mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useDeleteData());

        let success;
        await act(async () => {
            success = await result.current.deleteData('/api/clients/1');
        });

        expect(success).toBe(false);
        expect(result.current.error).toBe('Failed to delete data from the server.');
        expect(result.current.isDeleting).toBe(false);
    });

    it('should render hot toast message on failure', async () => {
        fetch.mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useDeleteData());

        let success;
        await act(async () => {
            success = await result.current.deleteData('/api/clients/1');
        });

        expect(success).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Hiba történt a törlés során!');
    });
});