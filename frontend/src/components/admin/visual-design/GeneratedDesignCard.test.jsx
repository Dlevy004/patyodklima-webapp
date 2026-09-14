import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import GeneratedDesignCard from './GeneratedDesignCard';

vi.mock('@/components/admin/common/HistoryCard', () => ({
    default: ({ imageUrl, alt, modifierClassName, children }) => (
        <div
            data-testid="history-card"
            data-image-url={imageUrl}
            data-alt={alt}
            data-modifier={modifierClassName}
        >
            {children}
        </div>
    )
}));

vi.mock('@/components/admin/common/ActionBtn', () => ({
    default: ({ type, onClick }) => (
        <button data-testid={`action-btn-${type}`} onClick={onClick}>
            {type}
        </button>
    )
}));

const baseDesign = {
    id: 'design-1',
    generated_image_url: 'https://example.com/generated.png',
    original_image_url: 'https://example.com/original.png',
    placement_type: 'indoor',
    status: 'completed'
};

describe('GeneratedDesignCard', () => {
    it('uses generated_image_url as the imageUrl when present', () => {
        render(<GeneratedDesignCard design={baseDesign} onDelete={vi.fn()} onDownload={vi.fn()} />);

        expect(screen.getByTestId('history-card')).toHaveAttribute(
            'data-image-url',
            baseDesign.generated_image_url
        );
    });

    it('falls back to original_image_url when generated_image_url is missing', () => {
        const design = { ...baseDesign, generated_image_url: undefined };
        render(<GeneratedDesignCard design={design} onDelete={vi.fn()} onDownload={vi.fn()} />);

        expect(screen.getByTestId('history-card')).toHaveAttribute(
            'data-image-url',
            baseDesign.original_image_url
        );
    });

    it('renders the indoor label in the alt text for indoor placement_type', () => {
        render(
            <GeneratedDesignCard
                design={{ ...baseDesign, placement_type: 'indoor' }}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
            />
        );

        expect(screen.getByTestId('history-card')).toHaveAttribute(
            'data-alt',
            'Látványterv - beltéri'
        );
    });

    it('renders the outdoor label in the alt text when placement_type is not indoor', () => {
        render(
            <GeneratedDesignCard
                design={{ ...baseDesign, placement_type: 'outdoor' }}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
            />
        );

        expect(screen.getByTestId('history-card')).toHaveAttribute(
            'data-alt',
            'Látványterv - kültéri'
        );
    });

    it('passes an empty modifierClassName when status is "completed"', () => {
        render(
            <GeneratedDesignCard
                design={{ ...baseDesign, status: 'completed' }}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
            />
        );

        expect(screen.getByTestId('history-card')).toHaveAttribute('data-modifier', '');
    });

    it('passes "is-dimmed" as modifierClassName when status is not "completed"', () => {
        render(
            <GeneratedDesignCard
                design={{ ...baseDesign, status: 'processing' }}
                onDelete={vi.fn()}
                onDownload={vi.fn()}
            />
        );

        expect(screen.getByTestId('history-card')).toHaveAttribute('data-modifier', 'is-dimmed');
    });

    it('calls onDownload with the correct id and filename when the download button is clicked', () => {
        const onDownload = vi.fn();
        render(
            <GeneratedDesignCard
                design={{ ...baseDesign, id: 'design-42', placement_type: 'outdoor' }}
                onDelete={vi.fn()}
                onDownload={onDownload}
            />
        );

        fireEvent.click(screen.getByTestId('action-btn-download'));

        expect(onDownload).toHaveBeenCalledTimes(1);
        expect(onDownload).toHaveBeenCalledWith('design-42', 'latvanyterv-kültéri');
    });

    it('calls onDelete when the delete button is clicked', () => {
        const onDelete = vi.fn();
        render(<GeneratedDesignCard design={baseDesign} onDelete={onDelete} onDownload={vi.fn()} />);

        fireEvent.click(screen.getByTestId('action-btn-delete'));

        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('renders both the download and delete ActionBtn buttons', () => {
        render(<GeneratedDesignCard design={baseDesign} onDelete={vi.fn()} onDownload={vi.fn()} />);

        expect(screen.getByTestId('action-btn-download')).toBeInTheDocument();
        expect(screen.getByTestId('action-btn-delete')).toBeInTheDocument();
    });
});