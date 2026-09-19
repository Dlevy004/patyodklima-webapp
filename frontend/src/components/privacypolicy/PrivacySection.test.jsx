import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import PrivacySection from './PrivacySection';


vi.mock('motion/react', () => ({
    motion: {
        section: ({ children, variants, ...domProps }) => (
            <section data-variants={variants ? JSON.stringify(variants) : undefined} {...domProps}>
                {children}
            </section>
        ),
    },
}));

describe('PrivacySection', () => {
    it('renders the number and title inside the heading, and the description', () => {
        render(
            <PrivacySection
                number="I."
                title="Az általunk kezelt adatok"
                desc="Kapcsolatfelvétel során az alábbi adatokat kezeljük:"
            />
        );

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('I. Az általunk kezelt adatok');
        expect(
            screen.getByText('Kapcsolatfelvétel során az alábbi adatokat kezeljük:')
        ).toBeInTheDocument();
    });

    it('renders no list items when items is omitted (default empty array)', () => {
        const { container } = render(
            <PrivacySection number="I." title="Cím" desc="Leírás" />
        );

        expect(container.querySelectorAll('li')).toHaveLength(0);
    });

    it('renders a list item with an icon for each plain-text item', () => {
        render(
            <PrivacySection
                number="II."
                title="Cím"
                desc="Leírás"
                items={['Első pont', 'Második pont']}
            />
        );

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
        expect(listItems[0]).toHaveTextContent('Első pont');
        expect(listItems[1]).toHaveTextContent('Második pont');

        // Minden listaelemben ott az ikon, mint dekoratív (aria-hidden) elem
        listItems.forEach((li) => {
            const icon = li.querySelector('svg[aria-hidden="true"]');
            expect(icon).toBeInTheDocument();
        });
    });

    it('renders items that are React nodes (not just strings), e.g. links', () => {
        render(
            <PrivacySection
                number="VI."
                title="Kapcsolat"
                desc="Elérhetőségek:"
                items={[
                    <a key="email" href="mailto:klima.patyod@gmail.com">klima.patyod@gmail.com</a>,
                ]}
            />
        );

        const link = screen.getByRole('link', { name: 'klima.patyod@gmail.com' });
        expect(link).toHaveAttribute('href', 'mailto:klima.patyod@gmail.com');
        // a linknek is meg kell kapnia az ikont, mert a <li> wrapper mindenkire ráteszi
        expect(link.closest('li').querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('passes the variants prop through to motion.section', () => {
        const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
        const { container } = render(
            <PrivacySection number="I." title="Cím" desc="Leírás" variants={variants} />
        );

        const section = container.querySelector('section.information');
        expect(section).toHaveAttribute('data-variants', JSON.stringify(variants));
    });

    it('renders without a variants prop (optional)', () => {
        const { container } = render(
            <PrivacySection number="I." title="Cím" desc="Leírás" />
        );

        const section = container.querySelector('section.information');
        expect(section).not.toHaveAttribute('data-variants');
    });

    it('renders a horizontal rule at the end of the section', () => {
        const { container } = render(
            <PrivacySection number="I." title="Cím" desc="Leírás" />
        );

        expect(container.querySelector('hr')).toBeInTheDocument();
    });
});