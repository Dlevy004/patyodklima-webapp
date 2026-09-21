import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import RevenueByCategoryChart from './RevenueByCategoryChart';
import useFetch from '@/hooks/useFetch';

vi.mock('@/hooks/useFetch');

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="mock-responsive-container">{children}</div>,
    PieChart: ({ children }) => <div data-testid="mock-pie-chart">{children}</div>,
    Pie: ({ data, nameKey }) => (
        <div data-testid="mock-pie">
            {data?.map((entry, index) => (
                <span key={index}>{entry[nameKey]}</span>
            ))}
        </div>
    ),
    Cell: () => null,
    Legend: () => null,
    Tooltip: ({ formatter }) => (
        <div data-testid="mock-tooltip">
            {formatter ? formatter(5000) : null}
        </div>
    ),
}));


describe('RevenueByCategoryChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('renders the chart title correctly', () => {
        useFetch.mockReturnValue({ data: null });
        render(<RevenueByCategoryChart />);

        expect(screen.getByText('Kategóriánkénti bevétel')).toBeInTheDocument();
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null });
        render(<RevenueByCategoryChart />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/revenue-by-category');
    });

    it('renders chart data correctly when data is fetched', () => {
        const mockData = [
            { category: 'installation', label: 'Telepítés', total: 450000 },
            { category: 'maintenance', label: 'Karbantartás', total: 120000 },
            { category: 'other', label: 'Egyéb', total: 50000 }
        ];

        useFetch.mockReturnValue({ data: mockData });
        render(<RevenueByCategoryChart />);

        expect(screen.getByText('Telepítés')).toBeInTheDocument();
        expect(screen.getByText('Karbantartás')).toBeInTheDocument();
        expect(screen.getByText('Egyéb')).toBeInTheDocument();
    });

    it('handles missing categories and renders safely', () => {
        const mockData = [
            { category: 'unknown_category', label: 'Ismeretlen', total: 10000 }
        ];

        useFetch.mockReturnValue({ data: mockData });
        const { container } = render(<RevenueByCategoryChart />);

        expect(screen.getByText('Ismeretlen')).toBeInTheDocument();
        expect(container.querySelector('.revenue-category-card')).toBeInTheDocument();
    });

    it('formats the tooltip currency value correctly', () => {
        useFetch.mockReturnValue({ data: [] });
        render(<RevenueByCategoryChart />);

        expect(screen.getByTestId('mock-tooltip')).toHaveTextContent(/5.*000.*Ft/);
    });
});