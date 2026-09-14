import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import useHistoryData from './useHistoryData';
import useFetch from './useFetch';

vi.mock('./useFetch', () => ({
    default: vi.fn()
}));


describe('useHistoryData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns values from useFetch when data exists', () => {
        const mockData = [
            { id: 1, name: 'Teszt 1' },
            { id: 2, name: 'Teszt 2' }
        ];

        const mockRefetch = vi.fn();

        useFetch.mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });

        const { result } = renderHook(() =>
            useHistoryData('/api/history')
        );

        expect(useFetch).toHaveBeenCalledWith('/api/history');

        expect(result.current).toEqual({
            data: mockData,
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });
    });

    it('returns an empty array when data is null', () => {
        const mockRefetch = vi.fn();

        useFetch.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });

        const { result } = renderHook(() =>
            useHistoryData('/api/history')
        );

        expect(result.current.data).toEqual([]);
    });
});