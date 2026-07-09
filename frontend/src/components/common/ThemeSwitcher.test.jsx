import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import ThemeSwitcher from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
    let mockStorage = {};
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: vi.fn((key) => mockStorage[key] || null),
            setItem: vi.fn((key, value) => { mockStorage[key] = String(value); }),
            clear: vi.fn(() => { mockStorage = {}; }),
        },
        writable: true
    });

    beforeEach(() => {
        globalThis.localStorage.clear();
        document.body.classList.remove('darkmode');
    });

    it('should render switcher button with light mode if local storage is empty', () => {
        render(<ThemeSwitcher />);

        const button = screen.getByRole('button', { name: 'Témaváltás (sötét/világos)' });
        const darkIcon = screen.getByTestId('dark-icon');
        const lightIcon = screen.queryByTestId('light-icon');

        expect(button).toBeInTheDocument();
        expect(document.body.classList.contains('darkmode')).toBe(false);
        expect(darkIcon).toBeInTheDocument();
        expect(lightIcon).not.toBeInTheDocument();
    });

    it('should render switcher button with dark mode if local storage is set to "active"', () => {
        localStorage.setItem('darkmode', 'active');
        render(<ThemeSwitcher />);

        const button = screen.getByRole('button', { name: 'Témaváltás (sötét/világos)' });
        const darkIcon = screen.queryByTestId('dark-icon');
        const lightIcon = screen.getByTestId('light-icon');

        expect(button).toBeInTheDocument();
        expect(document.body.classList.contains('darkmode')).toBe(true);
        expect(darkIcon).not.toBeInTheDocument();
        expect(lightIcon).toBeInTheDocument();
    });

    it('should toggle theme, body class, and local storage on button click', () => {
        render(<ThemeSwitcher />);

        const button = screen.getByRole('button', { name: 'Témaváltás (sötét/világos)' });

        expect(document.body.classList.contains('darkmode')).toBe(false);
        fireEvent.click(button);
        expect(document.body.classList.contains('darkmode')).toBe(true);

        expect(localStorage.getItem('darkmode')).toBe('active');
    });
});