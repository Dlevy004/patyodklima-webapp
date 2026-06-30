import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteDataModal from './DeleteDataModal';

describe('DeleteDataModal', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    it('should render title and description correctly', () => {
        render(
            <DeleteDataModal
                titleData="Ügyfél"
                descriptionData="ügyfelet"
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('Ügyfél törlése')).toBeInTheDocument();
        expect(screen.getByText('Biztos vagy benne, hogy törlöd a(z) ügyfelet?')).toBeInTheDocument();
    });

    it('should call onClose when Close button is clicked', () => {
        render(
            <DeleteDataModal
                titleData="Teszt" descriptionData="tesztet"
                onClose={mockOnClose} onDelete={mockOnDelete}
            />
        );

        fireEvent.click(screen.getByText('Mégse'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when Delete button is clicked', () => {
        render(
            <DeleteDataModal
                titleData="Teszt" descriptionData="tesztet"
                onClose={mockOnClose} onDelete={mockOnDelete}
            />
        );

        fireEvent.click(screen.getByText('Törlés'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
});