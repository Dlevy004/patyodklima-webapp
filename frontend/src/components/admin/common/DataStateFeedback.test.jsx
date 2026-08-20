import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import DataStateFeedback from './DataStateFeedback'


describe('DataStateFeedback', () => {
    it('should show loading text when isLoading is true', () => {
        render(
            <DataStateFeedback isLoading={true} error={null} isEmpty={false} emptyMessage=''>
                <p>children</p>
            </DataStateFeedback>
        );

        expect(screen.getByText('Betöltés folyamatban...')).toBeInTheDocument();
        expect(screen.queryByText('children')).not.toBeInTheDocument();
    });

    it('should show error text when error is present', () => {
        render(
            <DataStateFeedback isLoading={false} error='Testing error' isEmpty={false} emptyMessage=''>
                <p>children</p>
            </DataStateFeedback>
        );

        expect(screen.getByText('Hiba: Testing error')).toBeInTheDocument();
        expect(screen.queryByText('children')).not.toBeInTheDocument();
    });

    it('should show empty text when isEmpty is true', () => {
        render(
            <DataStateFeedback isLoading={false} error={null} isEmpty={true} emptyMessage='Array is empty.'>
                <p>children</p>
            </DataStateFeedback>
        );

        expect(screen.getByText('Array is empty.')).toBeInTheDocument();
        expect(screen.queryByText('children')).not.toBeInTheDocument();
    });

    it('should render the children when data is available', () => {
        render(
            <DataStateFeedback isLoading={false} error={null} isEmpty={false} emptyMessage=''>
                <p>Minta Máté</p>
            </DataStateFeedback>
        );

        expect(screen.getByText('Minta Máté')).toBeInTheDocument();
    });
});