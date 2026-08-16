import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import UploadedReference from './UploadedReference';

describe('UploadedReference', () => {
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnToggleVisibility = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the component with the provided props', () => {
        render(
            <UploadedReference
                title="Test Reference"
                imageUrl="test-image.jpg"
                isVisible={true}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        expect(screen.getByAltText('Test Reference')).toBeInTheDocument();
    });

    it('should contain the is-hidden class when isVisible is false', () => {
        render(
            <UploadedReference
                title="Test Reference"
                imageUrl="test-image.jpg"
                isVisible={false}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const referenceElement = screen.getByAltText('Test Reference').closest('li');
        expect(referenceElement).toHaveClass('uploaded-reference is-hidden');
    });

    it('should not contain the is-hidden class when isVisible is true', () => {
        render(
            <UploadedReference
                title="Test Reference"
                imageUrl="test-image.jpg"
                isVisible={true}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onToggleVisibility={mockOnToggleVisibility}
            />
        );

        const referenceElement = screen.getByAltText('Test Reference').closest('li');
        expect(referenceElement).not.toHaveClass('uploaded-reference is-hidden');
    });
});