import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ClientItem from './ClientItem'

describe('ClientItem', () => {
    const mockClient  = {
        name: 'Minta Máté',
        city: 'Budapest',
        phone: '06 20 1234 567'
    };

    it('should render client data correctly', () => {
        render(<ClientItem {...mockClient} />);

        expect(screen.getByText('Minta Máté')).toBeInTheDocument();
        expect(screen.getByText('Budapest')).toBeInTheDocument();
        expect(screen.getByText('06 20 1234 567')).toBeInTheDocument();
    });

    it('should render edit and delete button', () => {
        const { container } = render(<ClientItem {...mockClient} />);

        expect(container.querySelector('.edit-btn')).toBeInTheDocument();
        expect(container.querySelector('.delete-btn')).toBeInTheDocument();
    });
});