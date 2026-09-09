import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import toast from 'react-hot-toast';

import EditUserDataModal from './EditUserDataModal';
import useUserForm from '../../../hooks/useUserForm';

vi.mock('../../../hooks/useUserForm');
vi.mock('react-hot-toast');

vi.mock('../common/InputField', () => ({
    default: ({ label, value, onChange }) => (
        <div data-testid={`mock-input-${label}`}>
            <input
                aria-label={label}
                value={value || ''}
                onChange={onChange}
            />
        </div>
    )
}));


describe('EditUserDataModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    const defaultFormState = {
        formData: { fullName: '', currentPassword: '', newPassword: '', newPasswordConfirm: '' },
        formErrors: {},
        handleInputChange: vi.fn(),
        validateForm: vi.fn().mockReturnValue(true)
    };

    beforeEach(() => {
        vi.clearAllMocks();

        window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mocked-image-url');
        window.URL.revokeObjectURL = vi.fn();

        useUserForm.mockReturnValue(defaultFormState);
    });

    it('should render correctly with user profile picture', () => {
        const userData = { profilePicUrl: 'https://example.com/my-pic.png', fullName: 'Teszt Elek' };

        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={userData} />);

        expect(screen.getByText('Saját adatok módosítása')).toBeInTheDocument();
        const avatarImg = screen.getByAltText('Felhasználó profilképe');
        expect(avatarImg).toHaveAttribute('src', 'https://example.com/my-pic.png');
    });

    it('should render fallback placeholder if user has no profile picture', () => {
        const userData = { profilePicUrl: null };

        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={userData} />);

        const avatarImg = screen.getByAltText('Felhasználó profilképe');

        expect(avatarImg.src).toContain('profile-placeholder');
    });

    it('should call onClose when cancel button is clicked', () => {
        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        fireEvent.click(screen.getByText('Mégse'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should update preview URL when a new file is selected', () => {
        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        const fileInput = document.getElementById('profile-image-upload');
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(window.URL.createObjectURL).toHaveBeenCalledWith(file);

        const avatarImg = screen.getByAltText('Felhasználó profilképe');
        expect(avatarImg).toHaveAttribute('src', 'blob:http://localhost/mocked-image-url');
    });

    it('should NOT update preview URL if file dialog is cancelled (no file)', () => {
        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        const fileInput = document.getElementById('profile-image-upload');

        fireEvent.change(fileInput, { target: { files: [] } });

        expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('should show error toast and NOT call onSave if validation fails', async () => {
        useUserForm.mockReturnValue({
            ...defaultFormState,
            validateForm: vi.fn().mockReturnValue(false)
        });

        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        fireEvent.click(screen.getByText('Mentés'));

        expect(mockOnSave).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Hiba az adatok mentése közben.');
    });

    it('should submit FormData with only fullName if no password or file is provided', () => {
        useUserForm.mockReturnValue({
            ...defaultFormState,
            formData: { fullName: 'Új Név', currentPassword: '', newPassword: '' }
        });

        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        fireEvent.click(screen.getByText('Mentés'));

        expect(mockOnSave).toHaveBeenCalledTimes(1);

        const submittedFormData = mockOnSave.mock.calls[0][0];

        expect(submittedFormData.get('fullName')).toBe('Új Név');
        expect(submittedFormData.has('currentPassword')).toBe(false);
        expect(submittedFormData.has('profileImage')).toBe(false);
    });

    it('should append passwords and file to FormData if they are provided', () => {
        useUserForm.mockReturnValue({
            ...defaultFormState,
            formData: { fullName: 'Új Név', currentPassword: 'old', newPassword: 'new' }
        });

        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        const fileInput = document.getElementById('profile-image-upload');
        const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByText('Mentés'));

        expect(mockOnSave).toHaveBeenCalledTimes(1);

        const submittedFormData = mockOnSave.mock.calls[0][0];

        expect(submittedFormData.get('fullName')).toBe('Új Név');
        expect(submittedFormData.get('currentPassword')).toBe('old');
        expect(submittedFormData.get('newPassword')).toBe('new');
        expect(submittedFormData.get('profileImage')).toEqual(file);
    });

    it('should call handleInputChange with the correct field name and event when an input changes', () => {
        render(<EditUserDataModal onClose={mockOnClose} onSave={mockOnSave} userData={{}} />);

        const nameInput = screen.getByLabelText('Név megváltoztatása');

        fireEvent.change(nameInput, { target: { value: 'Kovács János' } });

        expect(defaultFormState.handleInputChange).toHaveBeenCalledTimes(1);

        expect(defaultFormState.handleInputChange).toHaveBeenCalledWith(
            'fullName',
            expect.anything()
        );
    });
});