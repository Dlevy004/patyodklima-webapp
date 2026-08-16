import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ReferenceHistory from './ReferenceHistory';
import useFetch from '@/hooks/useFetch';
import useSaveData from '@/hooks/useSaveData';
import useDeleteData from '@/hooks/useDeleteData';

vi.mock('@/hooks/useFetch');
vi.mock('@/hooks/useSaveData');
vi.mock('@/hooks/useDeleteData');


describe('ReferenceHistory', () => {
    const mockRefetch = vi.fn();
    const mockSaveData = vi.fn();
    const mockDeleteData = vi.fn();

    const mockReference = {
        id: '1',
        description: 'Teszt kép',
        image_url: 'kep1.jpg',
        is_visible: true
    };

    beforeEach(() => {
        vi.clearAllMocks();

        useSaveData.mockReturnValue({ saveData: mockSaveData });
        useDeleteData.mockReturnValue({ deleteData: mockDeleteData });
    });

    it('should render the loading message when isLoading is true', () => {
        useFetch.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
            refetch: mockRefetch
        });

        render(<ReferenceHistory />);

        expect(screen.getByText('Betöltés folyamatban...')).toBeInTheDocument();
    });

    it('should render the error message when error is present', () => {
        useFetch.mockReturnValue({
            data: [],
            isLoading: false,
            error: 'Valami hiba történt',
            refetch: mockRefetch
        });

        render(<ReferenceHistory />);

        expect(screen.getByText('Hiba: Valami hiba történt')).toBeInTheDocument();
    });

    it('should render the empty message when there are no references', () => {
        useFetch.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });

        render(<ReferenceHistory />);

        expect(screen.getByText('Nincsenek feltöltött referenciák.')).toBeInTheDocument();
    });

    it('should render an UploadedReference for each item in data', () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });

        render(<ReferenceHistory />);

        expect(screen.getByAltText('Teszt kép')).toBeInTheDocument();
    });

    it('should call saveData and refetch after a successful visibility toggle', async () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });
        mockSaveData.mockResolvedValue(true);

        render(<ReferenceHistory />);

        fireEvent.click(screen.getByLabelText('Láthatóság gomb'));

        await waitFor(() => {
            expect(mockSaveData).toHaveBeenCalledWith(
                'http://localhost:3000/api/references/1',
                'PUT',
                {
                    image_url: mockReference.image_url,
                    description: mockReference.description,
                    is_visible: !mockReference.is_visible
                }
            );
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });

    it('should not call refetch if the visibility toggle fails', async () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });
        mockSaveData.mockResolvedValue(false);

        render(<ReferenceHistory />);

        fireEvent.click(screen.getByLabelText('Láthatóság gomb'));

        await waitFor(() => {
            expect(mockSaveData).toHaveBeenCalledTimes(1);
        });
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should call deleteData and refetch after a successful delete', async () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });
        mockDeleteData.mockResolvedValue(true);

        render(<ReferenceHistory />);

        fireEvent.click(screen.getByLabelText('Törlés gomb'));

        const confirmDeleteBtn = document.querySelector('.modal-delete-btn');
        fireEvent.click(confirmDeleteBtn);

        await waitFor(() => {
            expect(mockDeleteData).toHaveBeenCalledWith('http://localhost:3000/api/references/1');
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });

    it('should not call refetch if the delete fails', async () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });
        mockDeleteData.mockResolvedValue(false);

        render(<ReferenceHistory />);

        fireEvent.click(screen.getByLabelText('Törlés gomb'));

        const confirmDeleteBtn = document.querySelector('.modal-delete-btn');
        fireEvent.click(confirmDeleteBtn);

        await waitFor(() => {
            expect(mockDeleteData).toHaveBeenCalledTimes(1);
        });
        expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should log the clicked reference when the edit button is clicked', () => {
        useFetch.mockReturnValue({
            data: [mockReference],
            isLoading: false,
            error: null,
            refetch: mockRefetch
        });

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        render(<ReferenceHistory />);

        fireEvent.click(screen.getByLabelText('Szerkesztés gomb'));

        expect(consoleSpy).toHaveBeenCalledWith('Clicked the following reference:', mockReference);

        consoleSpy.mockRestore();
    });
});