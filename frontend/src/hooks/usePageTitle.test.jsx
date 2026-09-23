import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import usePageTitle from './usePageTitle';
import { TitleContext } from '../context/TitleContext';


describe('usePageTitle hook', () => {
    it('calls setTitle from TitleContext with the provided title on mount', () => {
        const setTitleMock = vi.fn();

        const wrapper = ({ children }) => (
            <TitleContext.Provider value={{ setTitle: setTitleMock }}>
                {children}
            </TitleContext.Provider>
        );

        renderHook(() => usePageTitle('Kapcsolat'), { wrapper });

        expect(setTitleMock).toHaveBeenCalledWith('Kapcsolat');
        expect(setTitleMock).toHaveBeenCalledTimes(1);
    });

    it('calls setTitle again if the title argument changes', () => {
        const setTitleMock = vi.fn();

        const wrapper = ({ children }) => (
            <TitleContext.Provider value={{ setTitle: setTitleMock }}>
                {children}
            </TitleContext.Provider>
        );

        const { rerender } = renderHook(({ title }) => usePageTitle(title), {
            initialProps: { title: 'Első Oldal' },
            wrapper
        });

        expect(setTitleMock).toHaveBeenCalledWith('Első Oldal');

        rerender({ title: 'Második Oldal' });

        expect(setTitleMock).toHaveBeenCalledWith('Második Oldal');
    });
});