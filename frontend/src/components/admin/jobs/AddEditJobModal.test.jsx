import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import AddEditJobModal from './AddEditJobModal';
import useJobForm from '../../../hooks/useJobForm';

vi.mock('../../../hooks/useJobForm', () => ({
    default: vi.fn(),
    JobType: {
        SURVEY: 'survey',
        INSTALLATION: 'installation',
        MAINTENANCE: 'maintenance',
        CLEANING: 'cleaning'
    }
}));

vi.mock('react-select', () => ({
    default: ({ options, value, onChange, placeholder, inputId }) => (
        <select
            id={inputId}
            data-testid="mock-react-select"
            value={value ? value.value : ''}
            onChange={(e) => {
                const selectedOption = options.find(opt => String(opt.value) === String(e.target.value));
                onChange(selectedOption || null);
            }}
        >
            <option value="" disabled>{placeholder}</option>
            {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    )
}));

describe('AddEditJobModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockHandleInputChange = vi.fn();
    const mockValidateForm = vi.fn();

    const defaultFormData = {
        client_id: '',
        category: '',
        internal_notes: '',
        job_date: '',
        ac_unit: '',
        general_notes: '',
        labor_fee: '',
        total_amount: ''
    };

    const mockClients = [
        { id: 'client-1', full_name: 'Teszt Elek', city: 'Budapest' },
        { id: 'client-2', full_name: 'Minta Máté', city: 'Debrecen' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        useJobForm.mockReturnValue({
            formData: defaultFormData,
            formErrors: {},
            handleInputChange: mockHandleInputChange,
            validateForm: mockValidateForm
        });
    });

    it('should render "Új munka bejegyzése" title when jobData is not provided', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);
        expect(screen.getByText('Új munka bejegyzése')).toBeInTheDocument();
    });

    it('should render "Munka adatainak módosítása" title when jobData is provided', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} jobData={{ id: '1' }} />);
        expect(screen.getByText('Munka adatainak módosítása')).toBeInTheDocument();
    });

    it('should map clientsList to select options displaying name and city', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} clientsList={mockClients} />);

        expect(screen.getByText('Teszt Elek (Budapest)')).toBeInTheDocument();
        expect(screen.getByText('Minta Máté (Debrecen)')).toBeInTheDocument();
    });

    it('should call handleInputChange when an input field is changed', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const acUnitInput = screen.getByLabelText('Készülék típusa');
        fireEvent.change(acUnitInput, { target: { value: 'Midea' } });

        expect(mockHandleInputChange).toHaveBeenCalledWith('ac_unit', expect.any(Object));
    });

    it('should call onClose when the cancel button is clicked', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const cancelButton = screen.getByRole('button', { name: 'Mégse' });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should prevent submission and not call onSave if validation fails', () => {
        mockValidateForm.mockReturnValue(false);

        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const saveButton = screen.getByRole('button', { name: 'Mentés' });
        fireEvent.click(saveButton);

        expect(mockValidateForm).toHaveBeenCalledTimes(1);
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should parse labor_fee and total_amount to integers and call onSave if validation succeeds', () => {
        mockValidateForm.mockReturnValue(true);
        useJobForm.mockReturnValue({
            formData: {
                ...defaultFormData,
                labor_fee: '15000',
                total_amount: '200000'
            },
            formErrors: {},
            handleInputChange: mockHandleInputChange,
            validateForm: mockValidateForm
        });

        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const saveButton = screen.getByRole('button', { name: 'Mentés' });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
            labor_fee: 15000,
            total_amount: 200000
        }));
    });

    it('should fallback labor_fee and total_amount to 0 if they are empty', () => {
        mockValidateForm.mockReturnValue(true);
        useJobForm.mockReturnValue({
            formData: {
                ...defaultFormData,
                labor_fee: '',
                total_amount: null
            },
            formErrors: {},
            handleInputChange: mockHandleInputChange,
            validateForm: mockValidateForm
        });

        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const saveButton = screen.getByRole('button', { name: 'Mentés' });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
            labor_fee: 0,
            total_amount: 0
        }));
    });

    it('should call handleInputChange when the client_id select is changed', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} clientsList={mockClients} />);

        const clientSelect = screen.getByLabelText('Ügyfél kiválasztása');
        fireEvent.change(clientSelect, { target: { value: 'client-1' } });

        expect(mockHandleInputChange).toHaveBeenCalledWith('client_id', expect.any(Object));
    });

    it('should call handleInputChange when a leftField (e.g., category) is changed', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const categorySelect = screen.getByLabelText('Munka típusa');
        fireEvent.change(categorySelect, { target: { value: 'installation' } });

        expect(mockHandleInputChange).toHaveBeenCalledWith('category', expect.any(Object));
    });

    it('should call handleInputChange when a rightField (e.g., labor_fee) is changed', () => {
        render(<AddEditJobModal onClose={mockOnClose} onSave={mockOnSave} />);

        const laborFeeInput = screen.getByLabelText('Munkadíj');
        fireEvent.change(laborFeeInput, { target: { value: '15000' } });

        expect(mockHandleInputChange).toHaveBeenCalledWith('labor_fee', expect.any(Object));
    });
});