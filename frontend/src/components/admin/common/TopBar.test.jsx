import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import TopBar from './TopBar';
import { useAuth } from '../../../context/AuthContext';
import { usePWAInstall } from '../../../hooks/usePWAInstall';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usePWAInstall', () => ({
    usePWAInstall: vi.fn(),
}));

vi.mock('../../common/HamburgerMenu', () => ({
    default: ({ onClick, isOpen }) => (
        <button data-testid="mock-hamburger" onClick={onClick} data-isopen={isOpen}>
            Menu
        </button>
    )
}));

vi.mock('../profile/ProfilePanel', () => ({
    default: ({ onClose, isInstallable }) => (
        <div data-testid="mock-profile-panel" data-installable={isInstallable}>
            <button data-testid="mock-close-panel" onClick={onClose}>Bezárás panelből</button>
        </div>
    )
}));


describe('TopBar', () => {
    const mockOnMenuClick = vi.fn();
    const mockInstallPWA = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useAuth.mockReturnValue({
            user: { profilePicUrl: 'https://example.com/avatar.jpg' }
        });

        usePWAInstall.mockReturnValue({
            isInstallable: true,
            installPWA: mockInstallPWA
        });
    });

    it('should render the title correctly', () => {
        render(<TopBar title="Vezérlőpult" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        expect(screen.getByText('Vezérlőpult')).toBeInTheDocument();
    });

    it('should render user profile picture if provided', () => {
        render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        const img = screen.getByAltText('Profilkép');
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render placeholder picture if user or user.profilePicUrl is null', () => {
        useAuth.mockReturnValue({ user: null });

        render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        const img = screen.getByAltText('Profilkép');
        expect(img.src).toContain('profile-placeholder');
    });

    it('should toggle ProfilePanel visibility when profile button is clicked', () => {
        render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        expect(screen.queryByTestId('mock-profile-panel')).not.toBeInTheDocument();

        const profileBtn = screen.getByRole('button', { name: 'Profil beállítások' });
        fireEvent.click(profileBtn);

        expect(screen.getByTestId('mock-profile-panel')).toBeInTheDocument();
        expect(profileBtn).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(profileBtn);
        expect(screen.queryByTestId('mock-profile-panel')).not.toBeInTheDocument();
        expect(profileBtn).toHaveAttribute('aria-expanded', 'false');
    });

    it('should pass correct PWA props to ProfilePanel', () => {
        render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        fireEvent.click(screen.getByRole('button', { name: 'Profil beállítások' }));

        const panel = screen.getByTestId('mock-profile-panel');
        expect(panel).toHaveAttribute('data-installable', 'true');
    });

    it('should close ProfilePanel when onClose is called from within the panel', () => {
        render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        fireEvent.click(screen.getByRole('button', { name: 'Profil beállítások' }));
        expect(screen.getByTestId('mock-profile-panel')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('mock-close-panel'));

        expect(screen.queryByTestId('mock-profile-panel')).not.toBeInTheDocument();
    });

    it('should pass onMenuClick and isMobileMenuOpen to HamburgerMenu', () => {
        const { rerender } = render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

        const hamburger = screen.getByTestId('mock-hamburger');
        expect(hamburger).toHaveAttribute('data-isopen', 'false');

        fireEvent.click(hamburger);
        expect(mockOnMenuClick).toHaveBeenCalledTimes(1);

        rerender(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={true} />);
        expect(screen.getByTestId('mock-hamburger')).toHaveAttribute('data-isopen', 'true');
    });

    describe('Click outside functionality', () => {
        it('should close ProfilePanel when clicking outside of the wrapper', () => {
            render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

            fireEvent.click(screen.getByRole('button', { name: 'Profil beállítások' }));
            expect(screen.getByTestId('mock-profile-panel')).toBeInTheDocument();

            fireEvent.mouseDown(document.body);

            expect(screen.queryByTestId('mock-profile-panel')).not.toBeInTheDocument();
        });

        it('should NOT close ProfilePanel when clicking inside the wrapper', () => {
            render(<TopBar title="Cím" onMenuClick={mockOnMenuClick} isMobileMenuOpen={false} />);

            fireEvent.click(screen.getByRole('button', { name: 'Profil beállítások' }));

            const panel = screen.getByTestId('mock-profile-panel');
            fireEvent.mouseDown(panel);

            expect(panel).toBeInTheDocument();
        });
    });
});