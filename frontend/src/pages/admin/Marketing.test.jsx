import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Marketing from './Marketing';
import useFetch from '@/hooks/useFetch';

const {
    mockValidateForm,
    mockResetForm,
    mockHandleInputChange,
    mockRenderToMarketingCanvas,
    mockDownloadCanvasAsPng,
    mockCanvasToBlob,
    mockToastSuccess,
    mockToastError,
} = vi.hoisted(() => ({
    mockValidateForm: vi.fn(),
    mockResetForm: vi.fn(),
    mockHandleInputChange: vi.fn(),
    mockRenderMarketingToCanvas: vi.fn(),
    mockDownloadCanvasAsPng: vi.fn(),
    mockCanvasToBlob: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
}));

let mockFormData;

vi.mock('@/hooks/usePageTitle', () => ({ default: vi.fn() }));

vi.mock('@/hooks/useFetch', () => ({
    default: vi.fn((url) => ({
        data: url.includes('marketing-templates')
            ? [{ id: 1, background_image_url: 'template.jpg' }]
            : [{ id: 2, transparent_image_url: 'unit.png' }],
    })),
}));

vi.mock('@/hooks/useMarketingForm', () => ({
    default: () => ({
        formData: mockFormData,
        formErrors: {},
        handleInputChange: mockHandleInputChange,
        resetForm: mockResetForm,
        validateForm: mockValidateForm,
    }),
}));

vi.mock('@/utils/api', () => ({
    getAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer token' })),
}));

vi.mock('@/utils/marketingCanvas', () => ({
    renderAdToCanvas: mockRenderMarketingToCanvas,
    downloadCanvasAsPng: mockDownloadCanvasAsPng,
    canvasToBlob: mockCanvasToBlob,
}));

vi.mock('react-hot-toast', () => ({
    default: { success: mockToastSuccess, error: mockToastError },
}));

vi.mock('./Marketing.css', () => ({}));
vi.mock('@/assets/images/logo.avif', () => ({ default: 'logo.avif' }));
vi.mock('@/assets/images/phoneNumber.png', () => ({ default: 'phone.png' }));

vi.mock('@/components/admin/marketings/MarketingPreview', () => ({
    default: ({ template, onUndo, onDownload, onDelete }) => (
        <div>
            <span data-testid='selected-template'>{template?.id ?? 'none'}</span>
            <button onClick={onUndo}>undo</button>
            <button onClick={onDownload}>download</button>
            <button onClick={onDelete}>delete</button>
        </div>
    ),
}));

vi.mock('@/components/admin/marketings/MarketingCreatorSidebar', () => ({
    default: ({ step, onStepChange, onSelectTemplate, onSelectAcUnit, onFinish }) => (
        <div>
            <span data-testid='current-step'>{step}</span>
            <button onClick={() => onStepChange('text')}>text</button>
            <button onClick={() => onStepChange('devices')}>devices</button>
            <button onClick={() => onSelectTemplate(1)}>select-template</button>
            <button onClick={() => onSelectAcUnit(2)}>select-unit</button>
            <button onClick={onFinish}>finish</button>
        </div>
    ),
}));

vi.mock('@/components/admin/marketings/MarketingHistory', () => ({
    default: ({ refreshKey }) => <span data-testid='refresh-key'>{refreshKey}</span>,
}));

describe('Marketing', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockFormData = {
            headline: 'Nyári akció',
            acUnitName: 'Daikin Sensira',
            details: 'Telepítéssel\nGaranciával',
            price: 299000,
            showLogo: true,
            showPhone: true,
        };

        mockValidateForm.mockReturnValue(true);
        mockRenderMarketingToCanvas.mockResolvedValue('canvas');
        mockDownloadCanvasAsPng.mockResolvedValue();
        mockCanvasToBlob.mockResolvedValue(new Blob(['image'], { type: 'image/png' }));
        globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });
    });

    it('renders the initial state', () => {
        render(<Marketing />);
        expect(screen.getByText('templates')).toBeInTheDocument();
        expect(screen.getByTestId('refresh-key')).toHaveTextContent('0');
    });

    it('changes the step', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByRole('button', { name: 'text' }));
        expect(screen.getByTestId('current-step')).toHaveTextContent('text');
    });

    it('undoes from text to devices', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByRole('button', { name: 'text' }));
        fireEvent.click(screen.getByRole('button', { name: 'undo' }));
        expect(screen.getByTestId('current-step')).toHaveTextContent('devices');
    });

    it('undoes from devices to templates when no unit is selected', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('devices'));
        fireEvent.click(screen.getByText('undo'));
        expect(screen.getByText('templates')).toBeInTheDocument();
    });

    it('clears the selected unit when undoing from devices', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('devices'));
        fireEvent.click(screen.getByText('undo'));
        fireEvent.click(screen.getByText('undo'));
        expect(screen.getByText('templates')).toBeInTheDocument();
    });

    it('clears the selected template when undoing from templates', () => {
        render(<Marketing />);

        expect(screen.getByTestId('selected-template')).toHaveTextContent('none');

        fireEvent.click(screen.getByRole('button', { name: 'select-template' }));
        expect(screen.getByTestId('selected-template')).toHaveTextContent('1');

        fireEvent.click(screen.getByRole('button', { name: 'undo' }));
        expect(screen.getByTestId('selected-template')).toHaveTextContent('none');
    });

    it('does nothing when undoing from templates without a selected template', () => {
        render(<Marketing />);

        fireEvent.click(screen.getByRole('button', { name: 'undo' }));

        expect(screen.getByTestId('selected-template')).toHaveTextContent('none');
    });

    it('resets the form and selections when deleting', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('delete'));
        expect(mockResetForm).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith('A hirdetés alaphelyzetbe állítva.');
    });

    it('downloads the generated marketing successfully', async () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('download'));
        await waitFor(() => expect(mockDownloadCanvasAsPng).toHaveBeenCalledWith('canvas', 'nyári-akció.png'));
        expect(mockToastSuccess).toHaveBeenCalledWith('A hirdetés letöltése sikeres.');
    });

    it('uses the default filename when headline is empty', async () => {
        mockFormData.headline = '';
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('download'));
        await waitFor(() => expect(mockDownloadCanvasAsPng).toHaveBeenCalledWith('canvas', 'hirdetes.png'));
    });

    it('shows an error when downloading fails', async () => {
        mockRenderMarketingToCanvas.mockRejectedValue(new Error('Canvas error'));
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('download'));
        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Hiba történt a letöltés során.'));
    });

    it('shows an error when no template is selected', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('finish'));
        expect(mockToastError).toHaveBeenCalledWith('Előbb válassz egy sablont!');
    });

    it('shows an error when no unit is selected', () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('finish'));
        expect(mockToastError).toHaveBeenCalledWith('Előbb válassz egy készüléket!');
    });

    it('shows an error when the form is invalid', () => {
        mockValidateForm.mockReturnValue(false);
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('finish'));
        expect(mockToastError).toHaveBeenCalledWith('Kérlek töltsd ki a hiányzó mezőket!');
    });

    it('saves the marketing successfully', async () => {
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('finish'));

        await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/marketings/generate'),
            expect.objectContaining({ method: 'POST' })
        ));

        const [, options] = globalThis.fetch.mock.calls[0];
        expect(options.body.get('templateId')).toBe('1');
        expect(options.body.get('headline')).toBe('Nyári akció');
        expect(options.body.get('acUnitName')).toBe('Daikin Sensira');
        expect(options.body.get('details')).toBe('Telepítéssel\nGaranciával');
        expect(options.body.get('fullPrice')).toBe('299000');
        expect(options.body.get('showLogo')).toBe('true');
        expect(options.body.get('showPhone')).toBe('true');
        expect(mockToastSuccess).toHaveBeenCalledWith('A hirdetés elkészült!');
        expect(screen.getByTestId('refresh-key')).toHaveTextContent('1');
    });

    it('shows the API error message when saving fails', async () => {
        globalThis.fetch.mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ message: 'Mentési hiba' }),
        });

        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('finish'));

        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Mentési hiba'));
    });

    it('shows a fallback error when saving fails without a message', async () => {
        globalThis.fetch.mockResolvedValue({
            ok: false,
            json: () => Promise.reject(new Error('invalid json')),
        });

        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('finish'));

        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Hiba történt a hirdetés mentése során.'));
    });

    it('shows the error when canvas generation fails during saving', async () => {
        mockRenderMarketingToCanvas.mockRejectedValue(new Error('Canvas error'));
        render(<Marketing />);
        fireEvent.click(screen.getByText('select-template'));
        fireEvent.click(screen.getByText('select-unit'));
        fireEvent.click(screen.getByText('finish'));
        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Canvas error'));
    });

    it('uses empty arrays when fetched data is null', () => {
        vi.mocked(useFetch)
            .mockReturnValueOnce({ data: null })
            .mockReturnValueOnce({ data: null });

        render(<Marketing />);

        expect(screen.getByTestId('current-step')).toHaveTextContent('templates');
    });

    it('clears the selected template when undoing from templates', () => {
        render(<Marketing />);

        fireEvent.click(screen.getByRole('button', { name: 'select-template' }));
        fireEvent.click(screen.getByRole('button', { name: 'undo' }));

        fireEvent.click(screen.getByRole('button', { name: 'download' }));

        expect(mockRenderMarketingToCanvas).not.toHaveBeenCalled();
    });

    it('uses the fallback error message when saving fails without an error message', async () => {
        globalThis.fetch.mockRejectedValue(new Error(''));

        render(<Marketing />);

        fireEvent.click(screen.getByRole('button', { name: 'select-template' }));
        fireEvent.click(screen.getByRole('button', { name: 'select-unit' }));
        fireEvent.click(screen.getByRole('button', { name: 'finish' }));

        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith(
            'Hiba történt a hirdetés mentése során.'
        ));
    });
});