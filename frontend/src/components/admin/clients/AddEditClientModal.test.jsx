import {  render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import AddEditClientModal from './AddEditClientModal'


describe('AddEditClientModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    it('should add slide-right class when client type is company', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={{ type: 'company' }} />);

        const sliderElement = document.querySelector('.slide-right');

        expect(sliderElement).toBeInTheDocument();
    });

    it('should not add any class when client type is individual', () => {
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
    });

    it('should render empty data if client is not exists', () => {
        render(<AddEditClientModal onClose={mockOnClose} onSave={mockOnSave} clientData={null} />);

        expect(screen.getByText('Új ügyfél bejegyzése')).toBeInTheDocument();
    });
});