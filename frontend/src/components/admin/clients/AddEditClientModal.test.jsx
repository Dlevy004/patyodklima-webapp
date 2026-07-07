import {  render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import AddEditClientModal from './AddEditClientModal'


describe('AddEditClientModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('should add slide-right class when the client type is company', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={{ type: 'company' }} />);

        const sliderElement = document.querySelector('.slide-right');

        expect(sliderElement).toBeInTheDocument();
    });

    it('should not add any class when the client type is individual', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={{ type: 'individual' }} />);

        const sliderElement = document.querySelector('.slide-right');

        expect(sliderElement).not.toBeInTheDocument();
    });

    it('should render client data if it exists', () => {
        const mockClientData = {
            full_name: 'Minta Máté',
            phone: '06 20 1234 567',
            zip_code: '1234',
            city: 'Budapest',
            street_address: 'Fő utca 1.',
            email: 'minta.mate@example.com'
        };

        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={mockClientData} />);

        expect(screen.getByDisplayValue('Minta Máté')).toBeInTheDocument();
        expect(screen.getByDisplayValue('06 20 1234 567')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1234')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Budapest')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Fő utca 1.')).toBeInTheDocument();
        expect(screen.getByDisplayValue('minta.mate@example.com')).toBeInTheDocument();

        expect(screen.getByText('Ügyfél adatainak módosítása')).toBeInTheDocument();
    });

    it('should render empty data when client does not exist', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        expect(screen.queryByText('Új ügyfél bejegyzése')).toBeInTheDocument();
        expect(screen.queryByText('Ügyfél adatainak módosítása')).not.toBeInTheDocument();
    });

    it('should update form data when typing in an input field', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        const fullNameInputField = screen.getByLabelText('Ügyfél neve');

        fireEvent.change(fullNameInputField, { target: { value: 'Test Name' } });

        expect(fullNameInputField).toHaveValue('Test Name');
    });

    it('clears the validation error when the user edits the field after a failed submit', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(screen.getByText('Az ügyfél nevének megadása kötelező!')).toBeInTheDocument();

        const fullNameInputField = screen.getByLabelText('Ügyfél neve');
        fireEvent.change(fullNameInputField, { target: { value: 'Test Name' } });

        expect(screen.queryByText('Az ügyfél nevének megadása kötelező!')).not.toBeInTheDocument();
    });

    it('calls onSave with the entered data when the form is valid', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.change(screen.getByLabelText('Ügyfél neve'), { target: { value: 'Minta Máté' } });
        fireEvent.change(screen.getByLabelText('Ügyfél telefonszáma'), { target: { value: '06 20 123 4567' } });
        fireEvent.change(screen.getByPlaceholderText('Irányítószám'), { target: { value: '1234' } });
        fireEvent.change(screen.getByPlaceholderText('Város'), { target: { value: 'Budapest' } });
        fireEvent.change(screen.getByPlaceholderText('Utca, házszám'), { target: { value: 'Fő utca 1.' } });
        fireEvent.change(screen.getByLabelText('Ügyfél email címe (opcionális)'), { target: { value: 'minta.mate@example.com' } });

        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(mockOnSave).toHaveBeenCalledWith(
            expect.objectContaining({
                full_name: 'Minta Máté',
                phone: '06 20 123 4567',
                zip_code: '1234',
                city: 'Budapest',
                street_address: 'Fő utca 1.',
                email: 'minta.mate@example.com',
                type: 'individual'
            })
        );
    });

    it('should render the error message when the full name field is empty', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(screen.getByText('Az ügyfél nevének megadása kötelező!')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should render the error message when the phone number field is empty', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(screen.getByText('A telefonszám megadása kötelező!')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should render the error message when the phone number format is incorrect', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.change(screen.getByLabelText('Ügyfél telefonszáma'), { target: { value: '06 20 1234 567' } });
        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(screen.getByText('Helytelen formátum (pl: +36 30 123 4567)')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should render the error message when the zip code format is incorrect', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.change(screen.getByLabelText('Ügyfél címe'), { target: { value: '12345' } });
        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        expect(screen.getByText('Az irányítószám 4 számjegyből állhat!')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should render the error message when the email format is incorrect', async () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        fireEvent.change(screen.getByLabelText('Ügyfél neve'), { target: { value: 'Minta Máté' } });
        fireEvent.change(screen.getByLabelText('Ügyfél telefonszáma'), { target: { value: '06 20 123 4567' } });
        fireEvent.change(screen.getByLabelText('Ügyfél email címe (opcionális)'), { target: { value: 'test' } });
        fireEvent.click(screen.getByRole('button', { name: 'Mentés' }));

        await waitFor(() => {
            expect(screen.getByText('Helytelen email formátum!')).toBeInTheDocument();
        });
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should set the client type to company when the slider is clicked', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        const sliderButton = screen.getByRole('button', { name: 'Cég' });
        fireEvent.click(sliderButton);

        const sliderElement = document.querySelector('.slider-bg.slide-right');

        expect(sliderElement).toBeInTheDocument();
    });

    it('should set the client type to individual when the slider is clicked', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        const sliderButton = screen.getByRole('button', { name: 'Magánszemély' });
        fireEvent.click(sliderButton);

        const sliderElement = document.querySelector('.slider');

        expect(sliderElement).toBeInTheDocument();
    });

    it('updates the textarea value when the user types', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        const textarea = screen.getByLabelText('Megjegyzés (opcionális)');
        fireEvent.change(textarea, { target: { value: 'This is a note' } });

        expect(textarea).toHaveValue('This is a note');
    });
});