import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdHistory from './AdHistory';

const { mockDownloadFile, mockAdRef } = vi.hoisted(() => ({
    mockDownloadFile: vi.fn(),
    mockAdRef: { current: { id: '1', headline: 'Nyári akció' } },
}));

vi.mock('@/hooks/useFileDownload', () => ({
    default: () => ({ downloadFile: mockDownloadFile }),
}));

vi.mock('@/components/admin/common/HistoryList', () => ({
    default: ({ title, apiUrl, emptyMessage, deleteLabels, children }) => (
        <div>
            <span data-testid='title'>{title}</span>
            <span data-testid='api-url'>{apiUrl}</span>
            <span data-testid='empty-message'>{emptyMessage}</span>
            <span data-testid='delete-title'>{deleteLabels.titleData}</span>
            <span data-testid='delete-description'>{deleteLabels.descriptionData}</span>
            {children(mockAdRef.current, { key: mockAdRef.current.id, onDelete: vi.fn() })}
        </div>
    ),
}));

vi.mock('./GeneratedAdCard', () => ({
    default: ({ onDownload, onDelete, ad }) => (
        <div>
            <button onClick={() => onDownload(ad.id, ad.headline)}>download</button>
            <button onClick={onDelete}>delete</button>
        </div>
    ),
}));

describe('AdHistory', () => {
    beforeEach(() => {
        mockDownloadFile.mockClear();
        mockAdRef.current = { id: '1', headline: 'Nyári akció' };
    });

    it('renders HistoryList with the correct props', () => {
        render(<AdHistory refreshKey={1} />);

        expect(screen.getByTestId('title')).toHaveTextContent('Előzmények');
        expect(screen.getByTestId('api-url')).toHaveTextContent('/api/ads');
        expect(screen.getByTestId('empty-message')).toHaveTextContent('Még nincs elkészült hirdetés.');
        expect(screen.getByTestId('delete-title')).toHaveTextContent('Hirdetés');
        expect(screen.getByTestId('delete-description')).toHaveTextContent('hirdetést');
    });

    it('downloads an ad with the correct URL and filename', () => {
        render(<AdHistory refreshKey={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'download' }));

        expect(mockDownloadFile).toHaveBeenCalledWith('http://localhost:3000/api/ads/1/download', 'Nyári akció.png');
    });

    it('falls back to a generated filename when the ad has no headline', () => {
        mockAdRef.current = { id: '42', headline: undefined };
        render(<AdHistory refreshKey={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'download' }));

        expect(mockDownloadFile).toHaveBeenCalledWith(
            'http://localhost:3000/api/ads/42/download',
            'hirdetes-42.png'
        );
    });

    it('falls back to a generated filename when the headline is only whitespace', () => {
        mockAdRef.current = { id: '43', headline: '   ' };
        render(<AdHistory refreshKey={1} />);

        fireEvent.click(screen.getByRole('button', { name: 'download' }));

        expect(mockDownloadFile).toHaveBeenCalledWith(
            'http://localhost:3000/api/ads/43/download',
            'hirdetes-43.png'
        );
    });
});