import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import JobItem from './JobItem';

describe('JobItem', () => {
    const mockJob = {
        client_name: 'Teszt Elek',
        category: 'Telepítés',
        unit: 'Midea Xtreme',
        date: '2026-08-30',
        isCompleted: false
    };

    it('should render job data correctly', () => {
        render(<JobItem {...mockJob} onToggleStatus={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);

        expect(screen.getByText('Teszt Elek')).toBeInTheDocument();
        expect(screen.getByText('Telepítés')).toBeInTheDocument();
        expect(screen.getByText('Midea Xtreme')).toBeInTheDocument();
        expect(screen.getByText('2026-08-30')).toBeInTheDocument();
    });

    it('should NOT have completed class and should show completed button when isCompleted is false', () => {
        const { container } = render(
            <JobItem {...mockJob} isCompleted={false} onToggleStatus={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
        );

        const listItem = screen.getByRole('listitem');
        expect(listItem).not.toHaveClass('completed');

        expect(container.querySelector('.action-btn.completed')).toBeInTheDocument();
        expect(container.querySelector('.action-btn.pending')).not.toBeInTheDocument();
    });

    it('should have completed class and should show pending button when isCompleted is true', () => {
        const { container } = render(
            <JobItem {...mockJob} isCompleted={true} onToggleStatus={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
        );

        const listItem = screen.getByRole('listitem');
        expect(listItem).toHaveClass('completed');

        expect(container.querySelector('.action-btn.pending')).toBeInTheDocument();
        expect(container.querySelector('.action-btn.completed')).not.toBeInTheDocument();
    });

    it('should call onEdit when the list item itself is clicked', () => {
        const mockOnEdit = vi.fn();

        render(<JobItem {...mockJob} onToggleStatus={vi.fn()} onDelete={vi.fn()} onEdit={mockOnEdit} />);

        const listItem = screen.getByRole('listitem');
        fireEvent.click(listItem);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onEdit and stop propagation when edit button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnDelete = vi.fn();
        const mockOnToggle = vi.fn();

        const { container } = render(
            <JobItem {...mockJob} onToggleStatus={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />
        );

        const editButton = container.querySelector('.action-btn.edit');
        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).not.toHaveBeenCalled();
        expect(mockOnToggle).not.toHaveBeenCalled();
    });

    it('should call onDelete and stop propagation when delete button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnDelete = vi.fn();

        const { container } = render(
            <JobItem {...mockJob} onToggleStatus={vi.fn()} onDelete={mockOnDelete} onEdit={mockOnEdit} />
        );

        const deleteButton = container.querySelector('.action-btn.delete');
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should call onToggleStatus and stop propagation when toggle button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnToggle = vi.fn();

        const { container } = render(
            <JobItem {...mockJob} isCompleted={false} onToggleStatus={mockOnToggle} onDelete={vi.fn()} onEdit={mockOnEdit} />
        );

        const toggleButton = container.querySelector('.action-btn.completed');
        fireEvent.click(toggleButton);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should call onToggleStatus and stop propagation when pending button is clicked', () => {
        const mockOnEdit = vi.fn();
        const mockOnToggle = vi.fn();

        const { container } = render(
            <JobItem
                {...mockJob}
                isCompleted={true}
                onToggleStatus={mockOnToggle}
                onDelete={vi.fn()}
                onEdit={mockOnEdit}
            />
        );

        const toggleButton = container.querySelector('.action-btn.pending');
        fireEvent.click(toggleButton);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).not.toHaveBeenCalled();
    });
});