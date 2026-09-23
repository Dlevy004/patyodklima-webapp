import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneratedMarketingCard from './GeneratedMarketingCard';

vi.mock('@/components/admin/common/HistoryCard', () => ({
    default: ({ imageUrl, alt, modifierClassName, children }) => (
        <div data-testid='history-card' data-image={imageUrl} data-alt={alt} data-modifier={modifierClassName}>
            {children}
        </div>
    ),
}));

vi.mock('@/components/admin/common/ActionBtn', () => ({
    default: ({ type, onClick }) => <button onClick={onClick}>{type}</button>,
}));

const defaultProps = {
    marketing: { id: '1', generated_image_url: 'image.png', headline: 'Nyári akció', ac_unit_name: 'Daikin' },
    onDelete: vi.fn(),
    onDownload: vi.fn(),
};

describe('GeneratedMarketingCard', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the card with the headline as title', () => {
        render(<GeneratedMarketingCard {...defaultProps} />);

        const card = screen.getByTestId('history-card');
        expect(card).toHaveAttribute('data-image', 'image.png');
        expect(card).toHaveAttribute('data-alt', 'Nyári akció');
        expect(card).toHaveAttribute('data-modifier', 'is-landscape');
    });

    it('uses the AC unit name when headline is missing', () => {
        render(<GeneratedMarketingCard {...defaultProps} marketing={{ ...defaultProps.marketing, headline: '' }} />);

        expect(screen.getByTestId('history-card')).toHaveAttribute('data-alt', 'Daikin');
    });

    it('uses the default title when headline and AC unit name are missing', () => {
        render(<GeneratedMarketingCard {...defaultProps} marketing={{ ...defaultProps.marketing, headline: '', ac_unit_name: '' }} />);

        expect(screen.getByTestId('history-card')).toHaveAttribute('data-alt', 'Hirdetés');
    });

    it('calls onDownload with the marketing id and title', () => {
        render(<GeneratedMarketingCard {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'download' }));

        expect(defaultProps.onDownload).toHaveBeenCalledWith('1', 'Nyári akció');
    });

    it('calls onDelete when delete is clicked', () => {
        render(<GeneratedMarketingCard {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'delete' }));

        expect(defaultProps.onDelete).toHaveBeenCalled();
    });
});