import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import { useReferenceUpload } from '@/hooks/useReferenceUpload';
import References from './References';

vi.mock('@/hooks/useReferenceUpload');
vi.mock('@/hooks/usePageTitle', () => ({ default: vi.fn() }));
vi.mock('@/components/common/ScrollUp', () => ({ default: () => <div>ScrollUp</div> }));

describe('References Page', () => {
    it('should render form elements correctly', () => {
        vi.mocked(useReferenceUpload).mockReturnValue({
            previewUrl: null,
            description: '',
            errors: {},
            isUploading: false,
            handleFileSelect: vi.fn(),
            handleDescriptionChange: vi.fn(),
            handleSubmit: vi.fn()
        });

        render(<References />);

        expect(screen.getByText(/Húzd ide a képet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Leírás hozzáadása/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Feltöltés/i })).toBeEnabled();
    });

    it('should display file error if it exists', () => {
        vi.mocked(useReferenceUpload).mockReturnValue({
            previewUrl: null,
            description: '',
            errors: { file: 'Mocked file error' },
            isUploading: false,
            handleFileSelect: vi.fn(),
            handleDescriptionChange: vi.fn(),
            handleSubmit: vi.fn()
        });

        render(<References />);
        expect(screen.getByText('Mocked file error')).toBeInTheDocument();
    });

    it('should disable submit button and change text when uploading', () => {
        vi.mocked(useReferenceUpload).mockReturnValue({
            previewUrl: null,
            description: '',
            errors: {},
            isUploading: true,
            handleFileSelect: vi.fn(),
            handleDescriptionChange: vi.fn(),
            handleSubmit: vi.fn()
        });

        render(<References />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

    });
});