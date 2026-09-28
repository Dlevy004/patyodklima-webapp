import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import FAQItem from './FAQItem';


describe('FAQItem Component', () => {
    const mockProps = {
        question: 'Mit tartalmaz az ajánlat, és mi számít alapszerelésnek?',
        answer: 'Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.',
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
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen} onToggle={mockProps.onToggle}/>);

        expect(screen.getByText('Mit tartalmaz az ajánlat, és mi számít alapszerelésnek?')).toBeInTheDocument();
        expect(screen.getByText('Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.')).toBeInTheDocument();
    });

    it('applies the correct attributes and styles when closed', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen} onToggle={mockProps.onToggle}/>);

        const button = screen.getByRole('button', { name: /mit tartalmaz/i });
        const answerWrapper = screen.getByText('Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.').parentElement;
        const mainContainer = answerWrapper.parentElement;

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(answerWrapper).toHaveStyle({ maxHeight: '0px' });
        expect(mainContainer).not.toHaveClass('is-open');
    });

    it('applies the correct attributes and styles when open', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={true} onToggle={mockProps.onToggle}/>);

        const button = screen.getByRole('button', { name: /mit tartalmaz/i });
        const answerWrapper = screen.getByText('Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.').parentElement;
        const mainContainer = answerWrapper.parentElement;

        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(mainContainer).toHaveClass('is-open');
        expect(answerWrapper).toHaveStyle({ maxHeight: '150px' });
    });

    it('calls onToggle when clicked', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={mockProps.isOpen} onToggle={mockProps.onToggle}/>);

        const button = screen.getByRole('button', { name: /mit tartalmaz/i });
        fireEvent.click(button);

        expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
    });
});