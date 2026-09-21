import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import useIsMobile from './useIsMobile';


describe('useIsMobile hook', () => {
    let addEventListenerMock;
    let removeEventListenerMock;

    beforeEach(() => {
        addEventListenerMock = vi.fn();
        removeEventListenerMock = vi.fn();

        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
            dispatchEvent: vi.fn(),
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns true if the initial screen width is mobile (<= 640px)', () => {
        window.matchMedia.mockImplementation(() => ({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it('returns false if the initial screen width is desktop (> 640px)', () => {
        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it('updates state when resize event is fired', () => {
        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);

        const resizeHandler = addEventListenerMock.mock.calls[0][1];

        act(() => {
            resizeHandler({ matches: true });
        });

        expect(result.current).toBe(true);
    });

    it('removes event listener on unmount', () => {
        const { unmount } = renderHook(() => useIsMobile());

        expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

        unmount();

        expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
});