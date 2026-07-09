import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import useModal from './useModal';


describe('useModal', () => {
    it('should initialize with isOpen false and selectedItem null', () => {
        const { result } = renderHook(() => useModal());

        expect(result.current.isOpen).toBe(false);
        expect(result.current.selectedItem).toBeNull();
    });

    it('should set isOpen to true and selectedItem to null when open is called without an argument', () => {
        const { result } = renderHook(() => useModal());

        act(() => {
            result.current.open();
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.selectedItem).toBeNull();
    });

    it('should set isOpen to true and selectedItem to the given item when open is called with an argument', () => {
        const { result } = renderHook(() => useModal());
        const mockItem = { id: '1', full_name: 'Minta Máté' };

        act(() => {
            result.current.open(mockItem);
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.selectedItem).toEqual(mockItem);
    });

    it('should reset isOpen to false and selectedItem to null when close is called', () => {
        const { result } = renderHook(() => useModal());
        const mockItem = { id: '1', full_name: 'Minta Máté' };

        act(() => {
            result.current.open(mockItem);
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.selectedItem).toEqual(mockItem);

        act(() => {
            result.current.close();
        });

        expect(result.current.isOpen).toBe(false);
        expect(result.current.selectedItem).toBeNull();
    });
});