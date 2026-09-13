import { forwardRef, useImperativeHandle } from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

import VisualDesign from './VisualDesign';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));
import toast from 'react-hot-toast';


vi.mock('../../hooks/usePageTitle', () => ({
    default: vi.fn()
}));

vi.mock('../../components/common/ScrollUp', () => ({
    default: () => <div data-testid="scroll-up" />
}));

vi.mock('@/utils/api', () => ({
    getAuthHeaders: () => ({ Authorization: 'Bearer test-token' })
}));

vi.mock('@/components/admin/common/DragAndDrop', () => ({
    default: ({ onFileSelect, previewUrl }) => (
        <div data-testid="drag-and-drop">
            {previewUrl && <img src={previewUrl} alt="preview" data-testid="preview-image" />}
            <button
                type="button"
                data-testid="select-file-btn"
                onClick={() => onFileSelect(new File(['dummy-content'], 'photo.png', { type: 'image/png' }))}
            >
                select file
            </button>
            <button
                type="button"
                data-testid="select-nothing-btn"
                onClick={() => onFileSelect(null)}
            >
                select nothing
            </button>
        </div>
    )
}));

const maskApi = {
    hasSelection: vi.fn(() => true),
    reset: vi.fn(),
    getMaskBlob: vi.fn(() => Promise.resolve(new Blob(['mask'], { type: 'image/png' })))
};

vi.mock('@/components/admin/visual-design/MaskCanvas', () => ({
    default: forwardRef((props, ref) => {
        useImperativeHandle(ref, () => maskApi);
        return <div data-testid="mask-canvas" data-drawing={props.isDrawingMode ? 'true' : 'false'} />;
    })
}));

vi.mock('../../components/admin/common/Slider', () => ({
    default: ({ onButton1Click, onButton2Click, button1Title, button2Title }) => (
        <div data-testid="slider">
            <button type="button" data-testid="slider-btn-indoor" onClick={onButton1Click}>
                {button1Title}
            </button>
            <button type="button" data-testid="slider-btn-outdoor" onClick={onButton2Click}>
                {button2Title}
            </button>
        </div>
    )
}));

vi.mock('../../components/admin/common/ActionBtn', () => ({
    default: ({ type, onClick, className }) => (
        <button type="button" data-testid={`action-btn-${type}`} className={className} onClick={onClick}>
            {type}
        </button>
    )
}));

let lastAnchorDownload = null;

beforeAll(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-object-url');
    globalThis.URL.revokeObjectURL = vi.fn();
    HTMLAnchorElement.prototype.click = vi.fn(function click() {
        lastAnchorDownload = this.download;
    });
});

beforeEach(() => {
    vi.clearAllMocks();
    maskApi.hasSelection.mockReturnValue(true);
    maskApi.getMaskBlob.mockResolvedValue(new Blob(['mask'], { type: 'image/png' }));
    globalThis.fetch = vi.fn();
});

afterEach(() => {
    cleanup();
});

const selectFile = () => fireEvent.click(screen.getByTestId('select-file-btn'));

describe('VisualDesign', () => {
    it('renders without a preview image and without action buttons/mask canvas initially', () => {
        render(<VisualDesign />);

        expect(screen.getByTestId('drag-and-drop')).toBeInTheDocument();
        expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();
        expect(screen.queryByTestId('action-btn-undo')).not.toBeInTheDocument();
        expect(screen.queryByTestId('action-btn-download')).not.toBeInTheDocument();
        expect(screen.queryByTestId('action-btn-delete')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Generálás' })).toBeInTheDocument();
    });

    it('does nothing when onFileSelect is called with a falsy value', () => {
        render(<VisualDesign />);

        fireEvent.click(screen.getByTestId('select-nothing-btn'));

        expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
        expect(toast.success).not.toHaveBeenCalled();
    });

    it('sets the preview, shows the mask canvas + action buttons, and toasts success on file select', () => {
        render(<VisualDesign />);

        selectFile();

        expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('preview-image')).toHaveAttribute('src', 'blob:mock-object-url');
        expect(screen.getByTestId('mask-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('action-btn-undo')).toBeInTheDocument();
        expect(screen.getByTestId('action-btn-download')).toBeInTheDocument();
        expect(screen.getByTestId('action-btn-delete')).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith('A kép feltöltése sikeres.');
    });

    it('revokes the previous object URL on unmount (cleanup effect)', () => {
        const { unmount } = render(<VisualDesign />);

        selectFile();
        unmount();

        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-object-url');
    });

    it('resets all image-related state and toasts success on delete', () => {
        render(<VisualDesign />);

        selectFile();
        fireEvent.click(screen.getByTestId('action-btn-delete'));

        expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();
        expect(screen.queryByTestId('action-btn-delete')).not.toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith('A kép törlése sikeres.');
    });

    it('calls maskCanvas.reset() on undo when there is no generated image', () => {
        render(<VisualDesign />);

        selectFile();
        fireEvent.click(screen.getByTestId('action-btn-undo'));

        expect(maskApi.reset).toHaveBeenCalledTimes(1);
    });

    it('clears the generated image (falls back to the original) on undo when a design was generated', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ generated_image_url: 'https://example.com/generated.png' })
        });

        render(<VisualDesign />);
        selectFile();

        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByTestId('preview-image')).toHaveAttribute(
                'src',
                'https://example.com/generated.png'
            );
        });

        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('action-btn-undo'));

        await waitFor(() => {
            expect(screen.getByTestId('preview-image')).toHaveAttribute('src', 'blob:mock-object-url');
        });
        expect(screen.getByTestId('mask-canvas')).toBeInTheDocument();
        expect(maskApi.reset).not.toHaveBeenCalled();
    });

    it('does nothing when there is nothing to download', async () => {
        render(<VisualDesign />);

        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('downloads the original preview image and toasts success', async () => {
        const blob = new Blob(['image-bytes'], { type: 'image/png' });
        globalThis.fetch.mockResolvedValueOnce({ blob: async () => blob });

        render(<VisualDesign />);
        selectFile();

        fireEvent.click(screen.getByTestId('action-btn-download'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('A kép letöltése sikeres.');
        });
        expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
        expect(lastAnchorDownload).toBe('eredeti-kep.png');
    });

    it('downloads the generated image with the "latvanyterv.png" filename after a successful generation', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ generated_image_url: 'https://example.com/generated.png' })
        });

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByTestId('preview-image')).toHaveAttribute(
                'src',
                'https://example.com/generated.png'
            );
        });

        const downloadBlob = new Blob(['generated-bytes'], { type: 'image/png' });
        globalThis.fetch.mockResolvedValueOnce({ blob: async () => downloadBlob });

        fireEvent.click(screen.getByTestId('action-btn-download'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('A kép letöltése sikeres.');
        });
        expect(lastAnchorDownload).toBe('latvanyterv.png');
    });

    it('toasts an error and logs it when the download fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        globalThis.fetch.mockRejectedValueOnce(new Error('network down'));

        render(<VisualDesign />);
        selectFile();

        fireEvent.click(screen.getByTestId('action-btn-download'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Hiba történt a letöltés során.');
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith('Letöltési hiba:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('does not enter drawing mode when there is no image yet', () => {
        render(<VisualDesign />);

        fireEvent.click(screen.getByTestId('action-btn-draw'));

        expect(screen.getByTestId('action-btn-draw')).not.toHaveClass('is-active');
        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();
    });

    it('toggles drawing mode on and off once an image is present', () => {
        render(<VisualDesign />);
        selectFile();

        const drawBtn = screen.getByTestId('action-btn-draw');

        fireEvent.click(drawBtn);
        expect(screen.getByTestId('mask-canvas')).toHaveAttribute('data-drawing', 'true');
        expect(drawBtn).toHaveClass('is-active');

        fireEvent.click(drawBtn);
        expect(screen.getByTestId('mask-canvas')).toHaveAttribute('data-drawing', 'false');
        expect(drawBtn).not.toHaveClass('is-active');
    });

    it('does not toggle drawing mode once a design has been generated', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ generated_image_url: 'https://example.com/generated.png' })
        });

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByTestId('preview-image')).toHaveAttribute(
                'src',
                'https://example.com/generated.png'
            );
        });

        fireEvent.click(screen.getByTestId('action-btn-draw'));
        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();
    });

    it('shows an error toast and never calls fetch when no file was selected', () => {
        render(<VisualDesign />);

        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        expect(toast.error).toHaveBeenCalledWith('Előbb tölts fel egy képet!');
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('shows an error toast and never calls fetch when the mask has no selection', () => {
        maskApi.hasSelection.mockReturnValue(false);

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        expect(toast.error).toHaveBeenCalledWith('Jelöld be a klíma helyét a képen!');
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('shows a generic error toast (and the detailed inline error) when getMaskBlob resolves to null', async () => {
        maskApi.getMaskBlob.mockResolvedValueOnce(null);

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Hiba történt a generálás során.');
        });
        expect(screen.getByRole('alert')).toHaveTextContent('Nem sikerült elkészíteni a kijelölést.');
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('sends the correct FormData (image, mask, placementType) and shows the loading state while pending', async () => {
        let resolveFetch;
        globalThis.fetch.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveFetch = resolve;
            })
        );

        render(<VisualDesign />);
        selectFile();

        const form = screen.getByRole('button', { name: 'Generálás' }).closest('form');

        fireEvent.click(screen.getByTestId('slider-btn-outdoor'));

        fireEvent.submit(form);

        expect(screen.getByRole('button', { name: 'Generálás…' })).toBeDisabled();

        await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
        const [calledUrl, calledOptions] = globalThis.fetch.mock.calls[0];
        expect(calledUrl).toBe('http://localhost:3000/api/visual-designs/generate');
        expect(calledOptions.method).toBe('POST');
        expect(calledOptions.headers).toEqual({ Authorization: 'Bearer test-token' });

        const formData = calledOptions.body;
        expect(formData.get('placementType')).toBe('outdoor');
        expect(formData.get('image').name).toBe('photo.png');
        expect(formData.get('mask')).toBeInstanceOf(Blob);

        resolveFetch({ ok: true, json: async () => ({ generated_image_url: 'https://example.com/g.png' }) });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Generálás' })).not.toBeDisabled();
        });
    });

    it('shows the generated image and success toast on a successful response', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ generated_image_url: 'https://example.com/generated.png' })
        });

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByTestId('preview-image')).toHaveAttribute(
                'src',
                'https://example.com/generated.png'
            );
        });
        expect(toast.success).toHaveBeenCalledWith('A látványterv elkészült!');
        expect(screen.queryByTestId('mask-canvas')).not.toBeInTheDocument();
    });

    it('uses the backend-provided error message and shows it inline when the response is not ok', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'A kép és a maszk mérete nem egyezik.' })
        });

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('A kép és a maszk mérete nem egyezik.');
        });
        expect(toast.error).toHaveBeenCalledWith('Hiba történt a generálás során.');
    });

    it('falls back to a generic message when the error response body cannot be parsed as JSON', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => {
                throw new Error('invalid json');
            }
        });

        render(<VisualDesign />);
        selectFile();
        fireEvent.submit(screen.getByRole('button', { name: 'Generálás' }).closest('form'));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Hiba történt a generálás során.');
        });
    });

    it('changes placement type back to indoor when the indoor slider button is clicked', async () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                generated_image_url: 'https://example.com/generated.png'
            })
        });

        render(<VisualDesign />);
        selectFile();

        fireEvent.click(screen.getByTestId('slider-btn-outdoor'));
        fireEvent.click(screen.getByTestId('slider-btn-indoor'));

        fireEvent.submit(
            screen.getByRole('button', { name: 'Generálás' }).closest('form')
        );

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        });

        const [, calledOptions] = globalThis.fetch.mock.calls[0];
        const formData = calledOptions.body;

        expect(formData.get('placementType')).toBe('indoor');
    });
});