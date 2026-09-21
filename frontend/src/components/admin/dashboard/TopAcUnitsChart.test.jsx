import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import TopAcUnitsChart from './TopAcUnitsChart';
import useFetch from '@/hooks/useFetch';

vi.mock('@/hooks/useFetch');

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="mock-responsive-container">{children}</div>,
    BarChart: ({ children, data }) => (
        <div data-testid="mock-bar-chart">
            {data?.map((entry, index) => (
                <span key={index}>{entry.name}</span>
            ))}
            {children}
        </div>
    ),
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: ({ formatter }) => (
        <div data-testid="mock-tooltip">
            {formatter ? formatter(25).join(' | ') : null}
        </div>
    ),
}));


describe('TopAcUnitsChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('renders the chart title correctly', () => {
        useFetch.mockReturnValue({ data: null });
        render(<TopAcUnitsChart />);

        expect(screen.getByText('Legnépszerűbb készülékek')).toBeInTheDocument();
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null });
        render(<TopAcUnitsChart />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/top-ac-units');
    });

    it('renders chart data correctly when data is fetched', () => {
        const mockData = [
            { name: 'Gree Comfort X', count: 42 },
            { name: 'Midea Blanc', count: 18 }
        ];

        useFetch.mockReturnValue({ data: mockData });
        render(<TopAcUnitsChart />);

        expect(screen.getByText('Gree Comfort X')).toBeInTheDocument();
        expect(screen.getByText('Midea Blanc')).toBeInTheDocument();
    });

    it('renders safely when API returns empty array or null', () => {
        useFetch.mockReturnValue({ data: [] });
        const { container } = render(<TopAcUnitsChart />);

        expect(container.querySelector('.top-ac-units-card')).toBeInTheDocument();
    });

    it('formats the tooltip correctly', () => {
        useFetch.mockReturnValue({ data: [] });
        render(<TopAcUnitsChart />);

        expect(screen.getByTestId('mock-tooltip')).toHaveTextContent('25 db | Darabszám');
    });
});