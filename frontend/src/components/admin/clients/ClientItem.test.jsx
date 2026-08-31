import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ClientItem from './ClientItem'


describe('ClientItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    const mockClient  = {
        name: 'Minta Máté',
        city: 'Budapest',
        phone: '06 20 1234 567'
    };

    it('should render client data correctly', () => {
        render(<ClientItem {...mockClient} />);

        expect(screen.getByText('Minta Máté')).toBeInTheDocument();
        expect(screen.getByText('Budapest')).toBeInTheDocument();
        expect(screen.getByText('06 20 1234 567')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
        const { container } = render(<ClientItem {...mockClient} />);

        expect(container.querySelector('.action-btn.edit')).toBeInTheDocument();
        expect(container.querySelector('.action-btn.delete')).toBeInTheDocument();
    });

    it('should call onEdit and stop propagation when edit button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnDelete = vi.fn();

        const { container } = render(<ClientItem {...mockClient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const editButton = container.querySelector('.action-btn.edit');

        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('should call onDelete and stop propagation when delete button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnDelete = vi.fn();

        render(<ClientItem {...mockClient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByTitle('Törlés');
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).not.toHaveBeenCalled();
    });
});