import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import toast from 'react-hot-toast';

import EditCompanyDataModal from './EditCompanyDataModal';
import useCompanyForm from '../../../hooks/useCompanyForm';


vi.mock('../../../hooks/useCompanyForm');
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


describe('EditCompanyDataModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    const defaultFormState = {
        formData: {
            name: 'Pátyod', headquarters: '', registrationNumber: '',
            taxNumber: '', fGasNumber: '', phoneNumber: '', email: ''
        },
        formErrors: {},
        handleInputChange: vi.fn(),
        validateForm: vi.fn().mockReturnValue(true)
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useCompanyForm.mockReturnValue(defaultFormState);
    });

    it('should render all input fields correctly', () => {
        render(<EditCompanyDataModal onClose={mockOnClose} onSave={mockOnSave} companyData={{}} />);

        expect(screen.getByText('Cég adatok módosítása')).toBeInTheDocument();
        expect(screen.getByLabelText('Cég neve')).toBeInTheDocument();
        expect(screen.getByLabelText('Email cím')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(<EditCompanyDataModal onClose={mockOnClose} onSave={mockOnSave} companyData={{}} />);

        fireEvent.click(screen.getByText('Mégse'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call handleInputChange when an input value changes', () => {
        render(<EditCompanyDataModal onClose={mockOnClose} onSave={mockOnSave} companyData={{}} />);

        const nameInput = screen.getByLabelText('Cég neve');

        fireEvent.change(nameInput, { target: { value: 'Új Cég Név' } });

        expect(defaultFormState.handleInputChange).toHaveBeenCalledTimes(1);
        expect(defaultFormState.handleInputChange).toHaveBeenCalledWith(
            'name',
            expect.anything()
        );
    });

    it('should call onSave with formData when form is valid and submitted', async () => {
        render(<EditCompanyDataModal onClose={mockOnClose} onSave={mockOnSave} companyData={{}} />);

        fireEvent.click(screen.getByText('Mentés'));

        expect(defaultFormState.validateForm).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(defaultFormState.formData);
    });

    it('should show error toast and NOT call onSave when validation fails', async () => {
        useCompanyForm.mockReturnValue({
            ...defaultFormState,
            validateForm: vi.fn().mockReturnValue(false)
        });

        render(<EditCompanyDataModal onClose={mockOnClose} onSave={mockOnSave} companyData={{}} />);

        fireEvent.click(screen.getByText('Mentés'));

        expect(mockOnSave).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Kérjük, javítsa a hibákat a mentéshez!');
    });
});