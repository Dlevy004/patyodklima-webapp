import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const downloadFileMock = vi.fn();

vi.mock('../../../hooks/useFileDownload', () => ({
    default: () => ({ downloadFile: downloadFileMock })
}));

vi.mock('@/components/admin/common/HistoryList', () => ({
    default: ({ title, apiUrl, emptyMessage, deleteLabels, children }) => (
        <div
            data-testid="history-list"
            data-title={title}
            data-api-url={apiUrl}
            data-empty-message={emptyMessage}
            data-delete-labels={JSON.stringify(deleteLabels)}
        >
            {children(
                { id: 'design-1', placement_type: 'indoor' },
                { key: 'design-1', onDelete: vi.fn() }
            )}
        </div>
    )
}));

vi.mock('./GeneratedDesignCard', () => ({
    default: ({ design, onDownload }) => (
        <button data-testid="generated-design-card" onClick={() => onDownload(design.id, 'title')}>
            {design.id}
        </button>
    )
}));

import VisualDesignHistory from './VisualDesignHistory';


describe('VisualDesignHistory', () => {
    beforeEach(() => {
        downloadFileMock.mockClear();
    });

    it('passes the correct title, emptyMessage and deleteLabels props to HistoryList', () => {
        render(<VisualDesignHistory />);

        const historyList = screen.getByTestId('history-list');
        expect(historyList).toHaveAttribute('data-title', 'Előzmények');
        expect(historyList).toHaveAttribute('data-empty-message', 'Még nincs elkészült látványterv.');
        expect(JSON.parse(historyList.getAttribute('data-delete-labels'))).toEqual({
            titleData: 'Látványterv',
            descriptionData: 'látványtervet'
        });
    });

    it('passes an apiUrl built from VITE_API_URL to HistoryList', () => {
        render(<VisualDesignHistory />);

        const historyList = screen.getByTestId('history-list');
        expect(historyList.getAttribute('data-api-url')).toContain('/api/visual-designs');
        expect(historyList.getAttribute('data-api-url')).not.toContain('undefined');
    });

    it('renders GeneratedDesignCard as the HistoryList render-prop child', () => {
        render(<VisualDesignHistory />);

        expect(screen.getByTestId('generated-design-card')).toBeInTheDocument();
    });

    it('calls downloadFile with the correct URL and a .png filename on download', () => {
        render(<VisualDesignHistory />);

        fireEvent.click(screen.getByTestId('generated-design-card'));

        expect(downloadFileMock).toHaveBeenCalledTimes(1);
        const [url, filename] = downloadFileMock.mock.calls[0];
        expect(url).toContain('/api/visual-designs/design-1/download');
        expect(filename).toBe('title.png');
    });
});