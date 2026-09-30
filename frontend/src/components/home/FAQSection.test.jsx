import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import FAQSection from './FAQSection';

const renderWithHelmet = () => {
    return render( <FAQSection /> );
};


describe('FAQSection Component', () => {
    beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            value: 150,
        });
    });

    it('renders the section header, text, and contact card correctly', () => {
        renderWithHelmet();

        expect(screen.getByText('Gyakran ismételt kérdések')).toBeInTheDocument();
        expect(screen.getByText('Minden, amit a klímaszerelésről és a garanciáról tudni érdemes.')).toBeInTheDocument();

        expect(screen.getByText('További kérdésed van?')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /kapcsolatfelvétel/i })).toHaveAttribute('href', '#contact');
        expect(screen.getByAltText('Pátyod Klíma csapata')).toBeInTheDocument();
    });

    it('renders all FAQ questions from the list', () => {
        renderWithHelmet();

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(8);

        expect(screen.getByText('Mennyibe kerül a helyszíni felmérés?')).toBeInTheDocument();
        expect(screen.getByText('Milyen gyakran kell tisztíttatni a készüléket?')).toBeInTheDocument();
    });

    it('opens the first FAQ item by default and keeps others closed', () => {
        renderWithHelmet();

        const buttons = screen.getAllByRole('button');

        expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');

        expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles items correctly (accordion logic - only one open at a time)', () => {
        renderWithHelmet();

        const buttons = screen.getAllByRole('button');

        expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
        expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(buttons[1]);

        expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
        expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes the currently open item when clicked again', () => {
        renderWithHelmet();

        const buttons = screen.getAllByRole('button');

        expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(buttons[0]);

        expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    });

    it('injects the FAQPage JSON-LD structured data into the document head', async () => {
        renderWithHelmet();

        await waitFor(() => {
            const scriptTag = document.querySelector('script[type="application/ld+json"]');
            expect(scriptTag).toBeInTheDocument();

            expect(scriptTag.innerHTML).toContain('"@type":"FAQPage"');
            expect(scriptTag.innerHTML).toContain('Mennyibe kerül a helyszíni felmérés?');
        });
    });
});