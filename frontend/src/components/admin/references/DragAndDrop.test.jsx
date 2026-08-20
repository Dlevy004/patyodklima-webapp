import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { vi, it, describe, expect, beforeEach } from 'vitest';

import DragAndDrop from './DragAndDrop';


describe('DragAndDrop', () => {
    const mockOnFileSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render empty container when previewUrl is falsy', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} previewUrl={null} />);

        expect(screen.getByText('Húzd ide a képet vagy kattints ide a feltöltéshez')).toBeInTheDocument();
        expect(screen.queryByAltText('A feltöltött referenciakép előnézete')).not.toBeInTheDocument();
    });

    it('should render uploaded image when previewUrl is provided', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} previewUrl="blob:fake-url" />);

        expect(screen.getByAltText('A feltöltött referenciakép előnézete')).toBeInTheDocument();
        expect(screen.queryByText('Húzd ide a képet vagy kattints ide a feltöltéshez')).not.toBeInTheDocument();
    });

    it('should call onFileSelect with the correct file on drop', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} />);

        const dropzone = screen.getByText('Húzd ide a képet vagy kattints ide a feltöltéshez');
        const fakeFile = new File(['hello'], 'test.png', { type: 'image/png' });

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [fakeFile],
            },
        });

        expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFileSelect).toHaveBeenCalledWith(fakeFile);
    });

    it('should call onFileSelect with the correct file on input change', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} />);

        const input = document.querySelector('input[type="file"]');
        const fakeFile = new File(['hello'], 'test.png', { type: 'image/png' });

        fireEvent.change(input, { target: { files: [fakeFile] } });

        expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFileSelect).toHaveBeenCalledWith(fakeFile);
    });

    it('should prevent default browser behavior on drag over', () => {
        render(<DragAndDrop onFileSelect={vi.fn()} />);

        const dropzone = screen.getByText('Húzd ide a képet vagy kattints ide a feltöltéshez');
        const dragOverEvent = createEvent.dragOver(dropzone);

        dragOverEvent.preventDefault = vi.fn();
        fireEvent(dropzone, dragOverEvent);

        expect(dragOverEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should call onFileSelect and preventDefault on drop', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} />);

        const dropzone = screen.getByText('Húzd ide a képet vagy kattints ide a feltöltéshez');
        const fakeFile = new File(['hello'], 'test.png', { type: 'image/png' });

        const dropEvent = createEvent.drop(dropzone, {
            dataTransfer: { files: [fakeFile] }
        });
        dropEvent.preventDefault = vi.fn();

        fireEvent(dropzone, dropEvent);

        expect(dropEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockOnFileSelect).toHaveBeenCalledWith(fakeFile);
    });

    it('should not call onFileSelect if dropped without files', () => {
        render(<DragAndDrop onFileSelect={mockOnFileSelect} />);

        const dropzone = screen.getByText('Húzd ide a képet vagy kattints ide a feltöltéshez');

        const dropEvent = createEvent.drop(dropzone, {
            dataTransfer: { files: [] }
        });
        dropEvent.preventDefault = vi.fn();

        fireEvent(dropzone, dropEvent);

        expect(dropEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
});