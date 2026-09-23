import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import TopCitiesChart from './TopCitiesChart';
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
            {formatter ? formatter(15).join(' | ') : null}
        </div>
    ),
}));


describe('TopCitiesChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('renders the chart title correctly', () => {
        useFetch.mockReturnValue({ data: null });
        render(<TopCitiesChart />);

        expect(screen.getByText('Legnépszerűbb települések')).toBeInTheDocument();
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null });
        render(<TopCitiesChart />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/top-cities');
    });

    it('renders chart data correctly when data is fetched', () => {
        const mockData = [
            { name: 'Budapest', count: 150 },
            { name: 'Debrecen', count: 45 }
        ];

        useFetch.mockReturnValue({ data: mockData });
        render(<TopCitiesChart />);

        expect(screen.getByText('Budapest')).toBeInTheDocument();
        expect(screen.getByText('Debrecen')).toBeInTheDocument();
    });

    it('renders safely when API returns empty array or null', () => {
        useFetch.mockReturnValue({ data: [] });
        const { container } = render(<TopCitiesChart />);

        expect(container.querySelector('.top-cities-card')).toBeInTheDocument();
    });

    it('formats the tooltip correctly', () => {
        useFetch.mockReturnValue({ data: [] });
        render(<TopCitiesChart />);

        expect(screen.getByTestId('mock-tooltip')).toHaveTextContent('15 db | Darabszám');
    });

    it('renders the loading state when isLoading is true', () => {
        useFetch.mockReturnValue({ data: null, error: null, isLoading: true });
        render(<TopCitiesChart />);

        expect(screen.getByText('Betöltés…')).toBeInTheDocument();
        expect(screen.getByText('Legnépszerűbb települések')).toBeInTheDocument();
    });

    it('renders the error state with role="alert" when an error occurs', () => {
        useFetch.mockReturnValue({ data: null, error: new Error('Network error'), isLoading: false });
        render(<TopCitiesChart />);

        const alertMessage = screen.getByRole('alert');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Hiba történt az adatok betöltése közben.');
        expect(screen.getByText('Legnépszerűbb települések')).toBeInTheDocument();
    });
});