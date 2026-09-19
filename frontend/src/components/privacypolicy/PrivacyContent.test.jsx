import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import PrivacyContent from './PrivacyContent';

vi.mock('motion/react', () => ({
    motion: {
        div: ({ children, variants, initial, whileInView, viewport, transition, ...domProps }) => (
            <div {...domProps}>{children}</div>
        ),
        a: ({ children, variants, initial, whileInView, viewport, transition, ...domProps }) => (
            <a {...domProps}>{children}</a>
        ),
    },
}));

vi.mock('@/components/common/Wave', () => ({
    default: () => <div data-testid="wave" />,
}));

vi.mock('@/animations/variants', () => ({
    fadeInContainer: () => ({}),
    fadeInUp: () => ({}),
}));

vi.mock('@/assets/images/20250715_130101.avif', () => ({
    default: 'mocked-privacy-image.avif',
}));

vi.mock('./PrivacySection', () => ({
    default: ({ number, title, desc, items }) => (
        <section>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{desc}</p>
            <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </section>
    ),
}));


describe('PrivacyContent', () => {
    it('renders the main heading and intro text', () => {
        render(<PrivacyContent />);

        expect(
            screen.getByRole('heading', { level: 1, name: 'Adatkezelési tájékoztató' })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Fontos számunkra személyes adatainak védelme/)
        ).toBeInTheDocument();
    });

    it('renders the background image with the mocked src and correct alt text', () => {
        render(<PrivacyContent />);

        const img = screen.getByAltText('Kültéri egység karbantartása');
        expect(img).toHaveAttribute('src', 'mocked-privacy-image.avif');
        expect(img).toHaveAttribute('loading', 'eager');
    });

    it('renders all six privacy sections with the correct number, title and description', () => {
        render(<PrivacyContent />);

        const expectedSections = [
            { number: 'I.', title: 'Az általunk kezelt adatok' },
            { number: 'II.', title: 'Miért kezeljük az adatokat?' },
            { number: 'III.', title: 'Sütik (Cookie-k) használata' },
            { number: 'IV.', title: 'Az adatok tárolása és az adatfeldolgozók köre' },
            { number: 'V.', title: 'Az Ön jogai' },
            { number: 'VI.', title: 'Kapcsolat' },
        ];

        expectedSections.forEach(({ number, title }) => {
            expect(screen.getByText(number)).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
        });
    });

    it('renders the list items for a section with plain text items', () => {
        render(<PrivacyContent />);

        expect(screen.getByText('Név, e-mail cím, telefonszám')).toBeInTheDocument();
        expect(screen.getByText('Megkeresés tartalma, időpontja')).toBeInTheDocument();
    });

    it('renders the last section\'s items as real, clickable links (email and phone)', () => {
        render(<PrivacyContent />);

        const emailLink = screen.getByRole('link', { name: 'klima.patyod@gmail.com' });
        expect(emailLink).toHaveAttribute('href', 'mailto:klima.patyod@gmail.com');
        expect(emailLink).toHaveAttribute('target', '_blank');

        const phoneLink = screen.getByRole('link', { name: '06 30 629 0793' });
        expect(phoneLink).toHaveAttribute('href', 'tel:06306290793');
        expect(phoneLink).toHaveAttribute('target', '_blank');
    });

    it('renders the PDF download link with the correct attributes and text', () => {
        render(<PrivacyContent />);

        const downloadLink = screen.getByRole('link', {
            name: 'Teljes adatkezelési tájékoztató letöltése (PDF)',
        });

        expect(downloadLink).toHaveAttribute('href', '/patyodklima-adatkezelesi-tajekoztato.pdf');
        expect(downloadLink).toHaveAttribute('target', '_blank');
        expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders the Wave component', () => {
        render(<PrivacyContent />);

        expect(screen.getByTestId('wave')).toBeInTheDocument();
    });
});