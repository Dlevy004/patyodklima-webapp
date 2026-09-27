import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import FAQItem from './FaqItem';


describe('FAQItem Component', () => {
    const mockProps = {
        question: 'Mennyibe kerül a helyszíni felmérés?',
        answer: 'A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.',
        isOpen: false,
        onToggle: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            value: 150,
        });
    });

    it('renders the question and answer correctly', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen}
        onToggle={mockProps.onToggle} />);

        expect(screen.getByText('Mennyibe kerül a helyszíni felmérés?')).toBeInTheDocument();
        expect(screen.getByText('A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.')).toBeInTheDocument();
    });

    it('applies the correct attributes and styles when closed', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen}
        onToggle={mockProps.onToggle} />);

        const button = screen.getByRole('button', { name: /mennyibe kerül/i });
        const answerWrapper = screen.getByText('A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.').parentElement;
        const mainContainer = answerWrapper.parentElement;

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(answerWrapper).toHaveStyle({ maxHeight: '0px' });
        expect(mainContainer).not.toHaveClass('is-open');
    });

    it('applies the correct attributes and styles when open', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={true}
        onToggle={mockProps.onToggle} />);

        const button = screen.getByRole('button', { name: /mennyibe kerül/i });
        const answerWrapper = screen.getByText('A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.').parentElement;
        const mainContainer = answerWrapper.parentElement;

        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(mainContainer).toHaveClass('is-open');
    });

    it('calls onToggle and sets maxHeight on click (opening)', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen}
        onToggle={mockProps.onToggle} />);

        const button = screen.getByRole('button', { name: /mennyibe kerül/i });
        const answerWrapper = screen.getByText('A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.').parentElement;

        fireEvent.click(button);

        expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
        expect(answerWrapper).toHaveStyle({ maxHeight: '150px' });
    });

    it('calls onToggle and resets maxHeight to 0px on click (closing)', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={true}
        onToggle={mockProps.onToggle} />);

        const button = screen.getByRole('button', { name: /mennyibe kerül/i });
        const answerWrapper = screen.getByText('A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.').parentElement;

        fireEvent.click(button);

        expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
        expect(answerWrapper).toHaveStyle({ maxHeight: '0px' });
    });
});