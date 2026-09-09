import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import toast from 'react-hot-toast';

import ProfilePanel from './ProfilePanel';
import { useAuth } from '../../../context/AuthContext';
import useModal from '../../../hooks/useModal';
import useSaveData from '../../../hooks/useSaveData';

vi.mock('../../../context/AuthContext');
vi.mock('../../../hooks/useModal');
vi.mock('../../../hooks/useSaveData');
vi.mock('react-hot-toast');

vi.mock('../common/ModalBackdrop', () => ({
    default: ({ children, isOpen }) => (isOpen ? <div data-testid="mock-backdrop">{children}</div> : null),
}));

vi.mock('../profile/EditUserDataModal', () => ({
    default: ({ onSave, onClose }) => (
        <div data-testid="mock-edit-modal">
            <button onClick={() => onSave({ fullName: 'Új Név' })}>Mock Mentés</button>
            <button onClick={onClose}>Mock Mégse</button>
        </div>
    ),
}));

vi.mock('../profile/EditCompanyDataModal', () => ({
    default: ({ onSave, onClose }) => (
        <div data-testid="mock-company-modal">
            <button onClick={() => onSave({ name: 'Új Cég' })}>Mock Cég Mentés</button>
            <button onClick={onClose}>Mock Cég Mégse</button>
        </div>
    ),
}));


describe('ProfilePanel', () => {
    const mockLogout = vi.fn();
    const mockOnClose = vi.fn();
    const mockInstallPWA = vi.fn();

    const mockOpenModal = vi.fn();
    const mockCloseModal = vi.fn();
    const mockSaveData = vi.fn();

    const mockUser = {
        fullName: 'Daróczi Levente',
        role: 'developer',
        profilePicUrl: 'https://example.com/avatar.jpg',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        useAuth.mockReturnValue({ logout: mockLogout, user: mockUser });

        useModal.mockReturnValue({
            isOpen: false,
            open: mockOpenModal,
            close: mockCloseModal,
            selectedItem: mockUser,
        });

        useSaveData.mockReturnValue({ saveData: mockSaveData });

        import.meta.env.VITE_API_URL = 'http://localhost:3000';

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: vi.fn() },
        });
    });

    it('should render user details correctly if user data is provided', () => {
        render(<ProfilePanel />);

        expect(screen.getByText('Daróczi Levente')).toBeInTheDocument();
        expect(screen.getByText('developer')).toBeInTheDocument();

        const avatar = screen.getByAltText('Felhasználó profilképe');
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render fallback placeholders if user data is missing', () => {
        useAuth.mockReturnValue({ logout: mockLogout, user: null });

        render(<ProfilePanel />);

        expect(screen.getByText('Adminisztrátor')).toBeInTheDocument();
        const avatar = screen.getByAltText('Felhasználó profilképe');

        expect(avatar.src).toContain('profile-placeholder');
    });

    it('should call logout and onClose when Logout button is clicked', () => {
        render(<ProfilePanel onClose={mockOnClose} />);

        const logoutBtn = screen.getByText('Kijelentkezés');
        fireEvent.click(logoutBtn);

        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render PWA install button and trigger it when isInstallable is true', () => {
        render(<ProfilePanel isInstallable={true} installPWA={mockInstallPWA} />);

        const installBtn = screen.getByText('App telepítése');
        expect(installBtn).toBeInTheDocument();

        fireEvent.click(installBtn);
        expect(mockInstallPWA).toHaveBeenCalledTimes(1);
    });

    it('should NOT render PWA install button when isInstallable is false', () => {
        render(<ProfilePanel isInstallable={false} />);

        expect(screen.queryByText('App telepítése')).not.toBeInTheDocument();
    });

    it('should open EditUserDataModal with current user data when Edit button is clicked', () => {
        render(<ProfilePanel />);

        const editBtn = screen.getByText('Adatok módosítása');
        fireEvent.click(editBtn);

        expect(mockOpenModal).toHaveBeenCalledTimes(1);
        expect(mockOpenModal).toHaveBeenCalledWith(mockUser);
    });

    it('should call API, close modal, and reload page on successful save', async () => {
        useModal.mockReturnValue({
            isOpen: true,
            open: mockOpenModal,
            close: mockCloseModal,
            selectedItem: mockUser,
        });

        window.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'new-jwt-token' })
        });

        localStorage.clear();

        render(<ProfilePanel />);

        const saveBtn = screen.getByText('Mock Mentés');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/auth/profile',
                expect.objectContaining({
                    method: 'PUT',
                    body: { fullName: 'Új Név' }
                })
            );

            expect(localStorage.getItem('token')).toBe('new-jwt-token');

            expect(mockCloseModal).toHaveBeenCalledTimes(1);
            expect(window.location.reload).toHaveBeenCalledTimes(1);
        });
    });

    it('should NOT close modal or reload page if save fails', async () => {
        useModal.mockReturnValue({
            isOpen: true,
            open: mockOpenModal,
            close: mockCloseModal,
            selectedItem: mockUser,
        });

        window.fetch = vi.fn().mockResolvedValue({
            ok: false
        });

        render(<ProfilePanel />);

        const saveBtn = screen.getByText('Mock Mentés');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Hiba az adatok mentése során.');
        });

        expect(mockCloseModal).not.toHaveBeenCalled();
        expect(window.location.reload).not.toHaveBeenCalled();
    });

    it('should call logout and not crash if onClose is NOT provided when Logout button is clicked', () => {
        render(<ProfilePanel />);

        const logoutBtn = screen.getByText('Kijelentkezés');
        fireEvent.click(logoutBtn);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should fetch company data and open company modal on successful fetch', async () => {
        window.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ company: { name: 'Pátyod Klíma' } })
        });

        render(<ProfilePanel />);

        const companyBtn = screen.getByText('Cégadatok');
        fireEvent.click(companyBtn);

        expect(window.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/company',
            expect.objectContaining({ method: 'GET' })
        );

        await waitFor(() => {
            expect(mockOpenModal).toHaveBeenCalledWith({ name: 'Pátyod Klíma' });
        });
    });

    it('should show error toast if fetching company data returns a non-ok response', async () => {
        window.fetch = vi.fn().mockResolvedValue({
            ok: false
        });

        render(<ProfilePanel />);

        const companyBtn = screen.getByText('Cégadatok');
        fireEvent.click(companyBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Nem sikerült betölteni a cégadatokat.');
            expect(mockOpenModal).not.toHaveBeenCalled();
        });
    });

    it('should catch error, log it, and show error toast if fetch throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        window.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        render(<ProfilePanel />);

        const companyBtn = screen.getByText('Cégadatok');
        fireEvent.click(companyBtn);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Hiba történt a szerverrel való kommunikáció során.');
            expect(mockOpenModal).not.toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });

    it('should call API and close company modal on successful company save', async () => {
        useModal.mockReturnValue({
            isOpen: true,
            open: mockOpenModal,
            close: mockCloseModal,
            selectedItem: mockUser,
        });

        mockSaveData.mockResolvedValue(true);

        render(<ProfilePanel />);

        const saveBtn = screen.getByText('Mock Cég Mentés');
        fireEvent.click(saveBtn);

        expect(mockSaveData).toHaveBeenCalledWith(
            'http://localhost:3000/api/company',
            'PUT',
            { name: 'Új Cég' }
        );

        await waitFor(() => {
            expect(mockCloseModal).toHaveBeenCalledTimes(1);
        });
    });

    it('should NOT close company modal if saving company data fails', async () => {
        useModal.mockReturnValue({
            isOpen: true,
            open: mockOpenModal,
            close: mockCloseModal,
            selectedItem: mockUser,
        });

        mockSaveData.mockResolvedValue(false);

        render(<ProfilePanel />);

        const saveBtn = screen.getByText('Mock Cég Mentés');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(mockSaveData).toHaveBeenCalledTimes(1);
        });

        expect(mockCloseModal).not.toHaveBeenCalled();
    });
});