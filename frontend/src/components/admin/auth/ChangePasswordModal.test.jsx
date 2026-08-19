import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import ChangePasswordModal from './ChangePasswordModal';

const mockChangePassword = vi.fn();

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        changePassword: mockChangePassword,
    }),
}));

describe('ChangePasswordModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render password change form', () => {
        render(<ChangePasswordModal />);

        expect(screen.getByRole('heading', { name: 'Jelszó módosítása' })).toBeInTheDocument();
        expect(screen.getByLabelText('Jelenlegi jelszó')).toBeInTheDocument();
        expect(screen.getByLabelText('Új jelszó')).toBeInTheDocument();
        expect(screen.getByLabelText('Új jelszó megerősítése')).toBeInTheDocument();
    });

    it('should validate matching new passwords', async () => {
        render(<ChangePasswordModal />);

        fireEvent.change(screen.getByLabelText('Jelenlegi jelszó'), {
            target: { value: 'old-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó'), {
            target: { value: 'new-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó megerősítése'), {
            target: { value: 'different-password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Jelszó frissítése' }));

        expect(await screen.findByText('Az új jelszavak nem egyeznek.')).toBeInTheDocument();
        expect(mockChangePassword).not.toHaveBeenCalled();
    });

    it('should submit password change request', async () => {
        mockChangePassword.mockResolvedValue({ mustChangePassword: false });

        render(<ChangePasswordModal />);

        fireEvent.change(screen.getByLabelText('Jelenlegi jelszó'), {
            target: { value: 'old-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó'), {
            target: { value: 'new-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó megerősítése'), {
            target: { value: 'new-password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Jelszó frissítése' }));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                currentPassword: 'old-password',
                newPassword: 'new-password',
            });
        });
    });

    it('should show error if new password is too short', async () => {
        render(<ChangePasswordModal />);

        fireEvent.change(screen.getByLabelText('Jelenlegi jelszó'), {
            target: { value: 'old-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó'), {
            target: { value: 'short' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó megerősítése'), {
            target: { value: 'short' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Jelszó frissítése' }));

        expect(await screen.findByText('Az új jelszónak legalább 8 karakter hosszúnak kell lennie.')).toBeInTheDocument();
        expect(mockChangePassword).not.toHaveBeenCalled();
    });

    it('should show error message on API failure', async () => {
        mockChangePassword.mockRejectedValue(new Error('Hibás jelenlegi jelszó.'));
        render(<ChangePasswordModal />);

        fireEvent.change(screen.getByLabelText('Jelenlegi jelszó'), {
            target: { value: 'wrong-old-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó'), {
            target: { value: 'valid-new-password' },
        });
        fireEvent.change(screen.getByLabelText('Új jelszó megerősítése'), {
            target: { value: 'valid-new-password' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Jelszó frissítése' }));

        expect(await screen.findByText('Hibás jelenlegi jelszó.')).toBeInTheDocument();
    });
});
