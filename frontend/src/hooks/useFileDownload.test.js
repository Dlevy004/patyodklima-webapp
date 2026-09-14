import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import useFileDownload from './useFileDownload';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/utils/api';

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn()
    }
}));

vi.mock('@/utils/api', () => ({
    getAuthHeaders: vi.fn(() => ({
        Authorization: 'Bearer test-token'
    }))
}));


describe('useFileDownload', () => {
    let mockClick;

    beforeEach(() => {
        vi.clearAllMocks();

        globalThis.fetch = vi.fn();

        globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
        globalThis.URL.revokeObjectURL = vi.fn();

        mockClick = vi
            .spyOn(HTMLAnchorElement.prototype, 'click')
            .mockImplementation(() => {});
    });

    it('downloads the file successfully', async () => {
        const blob = new Blob(['test-image'], {
            type: 'image/png'
        });

        globalThis.fetch.mockResolvedValue({
            ok: true,
            blob: vi.fn().mockResolvedValue(blob)
        });

        const { result } = renderHook(() => useFileDownload());

        await act(async () => {
            await result.current.downloadFile(
                '/api/image/1/download',
                'teszt.png'
            );
        });

        expect(fetch).toHaveBeenCalledWith(
            '/api/image/1/download',
            {
                headers: {
                    Authorization: 'Bearer test-token'
                }
            }
        );

        expect(getAuthHeaders).toHaveBeenCalled();

        expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(blob);

        expect(mockClick).toHaveBeenCalled();

        expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
            'blob:mock-url'
        );

        expect(toast.error).not.toHaveBeenCalled();
    });

    it('uses the custom error message when the response fails', async () => {
        globalThis.fetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({
                message: 'Szerverhiba'
            })
        });

        const { result } = renderHook(() => useFileDownload());

        await act(async () => {
            await result.current.downloadFile(
                '/api/image/1/download',
                'teszt.png',
                'Egyedi hibaüzenet'
            );
        });

        expect(toast.error).toHaveBeenCalledWith(
            'Egyedi hibaüzenet'
        );

        expect(globalThis.URL.createObjectURL).not.toHaveBeenCalled();
        expect(mockClick).not.toHaveBeenCalled();
    });

    it('uses the default error message when the response fails without a server message', async () => {
        globalThis.fetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
        });

        const { result } = renderHook(() => useFileDownload());

        await act(async () => {
            await result.current.downloadFile(
                '/api/image/1/download',
                'teszt.png'
            );
        });

        expect(toast.error).toHaveBeenCalledWith(
            'Nem sikerült letölteni a képet.'
        );
    });

    it('uses the default server error message when response JSON has no message', async () => {
        globalThis.fetch.mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({})
        });

        const { result } = renderHook(() => useFileDownload());

        await act(async () => {
            await result.current.downloadFile(
                '/api/image/1/download',
                'teszt.png'
            );
        });

        expect(toast.error).toHaveBeenCalledWith(
            'Nem sikerült letölteni a képet.'
        );
    });

    it('handles fetch errors', async () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        globalThis.fetch.mockRejectedValue(
            new Error('Network error')
        );

        const { result } = renderHook(() => useFileDownload());

        await act(async () => {
            await result.current.downloadFile(
                '/api/image/1/download',
                'teszt.png'
            );
        });

        expect(consoleError).toHaveBeenCalledWith(
            'Letöltési hiba:',
            'Network error'
        );

        expect(toast.error).toHaveBeenCalledWith(
            'Nem sikerült letölteni a képet.'
        );

        consoleError.mockRestore();
    });
});