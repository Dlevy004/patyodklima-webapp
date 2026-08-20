import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ModalBackdrop from './ModalBackdrop';


describe('ModalBackdrop', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOnClose = vi.fn();

    it('should not render anything if isOpen is false', () => {
        const { container } = render(
            <ModalBackdrop isOpen={false} onClose={mockOnClose}>
                <p>Children</p>
            </ModalBackdrop>
        );

        expect(container.firstChild).toBeNull();
    });

    it('should render the backdrop if isOpen is true', () => {
        const { container } = render(
            <ModalBackdrop isOpen={true} onClose={mockOnClose}>
                <p>Children</p>
            </ModalBackdrop>
        );

        expect(container.firstChild).not.toBeNull();
    });

    it('should call onClose when clicking on the backdrop', () => {
        render(
            <ModalBackdrop isOpen={true} onClose={mockOnClose}>
                <p>Children</p>
            </ModalBackdrop>
        );

        const backdropDiv = document.querySelector('.backdrop');
        fireEvent.click(backdropDiv);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when clicking on the children', () => {
        render(
            <ModalBackdrop isOpen={true} onClose={mockOnClose}>
                <p>Children</p>
            </ModalBackdrop>
        );

        const childrenP = document.querySelector('p');
        fireEvent.click(childrenP);

        expect(mockOnClose).not.toHaveBeenCalled();
    });
});