import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useContext } from 'react';

import { TitleContext, TitleProvider } from './TitleContext';

const TestComponent = () => {
    const { title, setTitle } = useContext(TitleContext);

    return (
        <div>
            <span data-testid="title-display">{title}</span>
            <button onClick={() => setTitle('Új Oldalnév')}>Cím megváltoztatása</button>
        </div>
    );
};

describe('TitleProvider', () => {
    beforeEach(() => {
        document.title = '';
    });

    it('renders children correctly and provides default title', () => {
        render(
            <TitleProvider>
                <TestComponent />
            </TitleProvider>
        );

        expect(screen.getByTestId('title-display')).toHaveTextContent('Pátyod Klíma');
        expect(document.title).toBe('Pátyod Klíma | Pátyod Klíma');
    });

    it('updates document.title when setTitle is called by a consumer', () => {
        render(
            <TitleProvider>
                <TestComponent />
            </TitleProvider>
        );

        const button = screen.getByRole('button', { name: 'Cím megváltoztatása' });

        fireEvent.click(button);

        expect(screen.getByTestId('title-display')).toHaveTextContent('Új Oldalnév');
        expect(document.title).toBe('Pátyod Klíma | Új Oldalnév');
    });
});