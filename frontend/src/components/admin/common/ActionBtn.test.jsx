import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ActionButton from './ActionBtn';

describe('ActionButton', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('should render the correct icon and label for each type', () => {
        render([
            <ActionButton type='edit' onClick={mockOnClick} />,
            <ActionButton type='delete' onClick={mockOnClick} />,
            <ActionButton type='visible' onClick={mockOnClick} />,
            <ActionButton type='invisible' onClick={mockOnClick} />
        ]);

        expect(screen.getByLabelText('Szerkesztés gomb')).toBeInTheDocument();
        expect(screen.getByLabelText('Törlés gomb')).toBeInTheDocument();
        expect(screen.getByLabelText('Láthatóság gomb')).toBeInTheDocument();
        expect(screen.getByLabelText('Elrejtés gomb')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        render(<ActionButton type='delete' onClick={mockOnClick}/>)

        fireEvent.click(screen.getByLabelText('Törlés gomb'));

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});