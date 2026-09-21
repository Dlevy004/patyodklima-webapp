import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NotFound from './NotFound';

const { mockUsePageTitle } = vi.hoisted(() => ({
    mockUsePageTitle: vi.fn(),
}));

vi.mock('@/hooks/usePageTitle', () => ({
    default: mockUsePageTitle,
}));

vi.mock('@/components/common/Seo', () => ({
    default: ({ noindex, ...props }) => (
        <div data-testid='seo' data-noindex={String(noindex)} {...props} />
    ),
}));

vi.mock('./NotFound.css', () => ({}));


describe('NotFound', () => {
    it('renders the 404 page correctly', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        expect(mockUsePageTitle).toHaveBeenCalledWith('Az oldal nem található');

        expect(screen.getByTestId('seo')).toHaveAttribute('title', 'Pátyod Klíma | Az oldal nem található');
        expect(screen.getByTestId('seo')).toHaveAttribute('description', 'A keresett oldal nem található a Pátyod Klíma weboldalán.');
        expect(screen.getByTestId('seo')).toHaveAttribute('data-noindex', 'true');

        expect(screen.getByAltText('404 logó')).toHaveAttribute('src', '/images/404.png');
        expect(screen.getByAltText('404 ember logó')).toHaveAttribute('src', '/images/404worker.png');

        expect(screen.getByText('A keresett oldal nem található.')).toBeInTheDocument();
        expect(screen.getByText('Sajnos az oldal, amit keres, törölve lett, megváltozott a címe, vagy ideiglenesen nem elérhető.')).toBeInTheDocument();

        const link = screen.getByRole('link', { name: 'Vissza a főoldalra' });
        expect(link).toHaveAttribute('href', '/');
    });
});