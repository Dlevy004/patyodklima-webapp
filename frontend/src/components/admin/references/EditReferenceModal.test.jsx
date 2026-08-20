import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditReferenceModal from './EditReferenceModal';


describe('EditReferenceModal Component', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockReferenceData = {
        id: 1,
        description: 'Régi leírás',
        image_url: 'test.jpg'
    };

    it('should render correctly with initial data', () => {
        render(<EditReferenceModal onClose={mockOnClose} onSave={mockOnSave} referenceData={mockReferenceData} />);

        expect(screen.getByText('Referenciakép szerkesztése')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Régi leírás')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(<EditReferenceModal onClose={mockOnClose} onSave={mockOnSave} referenceData={mockReferenceData} />);

        fireEvent.click(screen.getByText('Mégse'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should update description and call onSave with new data on submit', () => {
        render(<EditReferenceModal onClose={mockOnClose} onSave={mockOnSave} referenceData={mockReferenceData} />);

        const input = screen.getByDisplayValue('Régi leírás');

        fireEvent.change(input, { target: { value: 'Új csodás leírás' } });

        fireEvent.click(screen.getByText('Mentés'));

        expect(mockOnSave).toHaveBeenCalledWith({
            ...mockReferenceData,
            description: 'Új csodás leírás'
        });
    });

    it('should not set a description when referenceData is null', () => {
        render(<EditReferenceModal onClose={mockOnClose} onSave={mockOnSave} referenceData={null} />);

        const textarea = screen.getByLabelText('Leírás szerkesztése');
        expect(textarea).toHaveValue('');
    });

    it('should fall back to an empty string when referenceData has no description', () => {
        const referenceWithoutDescription = { id: 2, image_url: 'test2.jpg' };

        render(<EditReferenceModal onClose={mockOnClose} onSave={mockOnSave} referenceData={referenceWithoutDescription} />);

        const textarea = screen.getByLabelText('Leírás szerkesztése');
        expect(textarea).toHaveValue('');
    });
});