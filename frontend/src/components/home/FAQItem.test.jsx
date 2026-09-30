import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import FAQItem from './FAQItem';


class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
        ResizeObserverMock.instances.push(this);
    }
    observe(target) {
        this.target = target;
    }
    unobserve() {}
    disconnect() {
        const idx = ResizeObserverMock.instances.indexOf(this);
        if (idx !== -1) ResizeObserverMock.instances.splice(idx, 1);
    }
}
ResizeObserverMock.instances = [];

const triggerResize = () => {
    act(() => {
        const observer = ResizeObserverMock.instances[ResizeObserverMock.instances.length - 1];
        observer.callback();
    });
};


describe('FAQItem Component', () => {
    const mockProps = {
        question: 'Mit tartalmaz az ajánlat, és mi számít alapszerelésnek?',
        answer: 'Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.',
        isOpen: false,
        onToggle: vi.fn(),
    };

    let originalResizeObserver;

    beforeEach(() => {
        vi.clearAllMocks();
        ResizeObserverMock.instances = [];

        originalResizeObserver = globalThis.ResizeObserver;
        globalThis.ResizeObserver = ResizeObserverMock;

        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            value: 150,
        });
    });

    afterEach(() => {
        globalThis.ResizeObserver = originalResizeObserver;
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

    it('recalculates the panel height when the open answer text is resized', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={true} onToggle={mockProps.onToggle}/>);

        const answerWrapper = screen.getByText(mockProps.answer).parentElement;
        expect(answerWrapper).toHaveStyle({ maxHeight: '150px' });

        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            value: 220,
        });

        triggerResize();

        expect(answerWrapper).toHaveStyle({ maxHeight: '220px' });
    });

    it('does not observe the answer when closed', () => {
        render(<FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={false} onToggle={mockProps.onToggle}/>);

        expect(ResizeObserverMock.instances).toHaveLength(0);
    });

    it('disconnects the observer when the item closes', () => {
        const { rerender } = render(
            <FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={true} onToggle={mockProps.onToggle}/>
        );

        expect(ResizeObserverMock.instances).toHaveLength(1);

        rerender(
            <FAQItem question={mockProps.question} answer={mockProps.answer} isOpen={false} onToggle={mockProps.onToggle}/>
        );

        expect(ResizeObserverMock.instances).toHaveLength(0);
    });
});