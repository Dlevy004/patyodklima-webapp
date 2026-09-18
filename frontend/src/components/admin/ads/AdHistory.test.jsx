import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdHistory from './AdHistory';

const { mockDownloadFile } = vi.hoisted(() => ({ mockDownloadFile: vi.fn() }));

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
            {children({ id: '1', headline: 'Nyári akció' }, { key: '1', onDelete: vi.fn() })}
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
});