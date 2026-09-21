import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import JobsStatusChart from './JobsStatusChart';
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
            {formatter ? formatter(5) : null}
        </div>
    ),
}));

describe('JobsStatusChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('renders loading state correctly when isLoading is true', () => {
        useFetch.mockReturnValue({ data: null, isLoading: true, error: null });
        render(<JobsStatusChart />);

        expect(screen.getByText('Betöltés…')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
    });

    it('renders error state correctly when error exists', () => {
        useFetch.mockReturnValue({ data: null, isLoading: false, error: 'Hiba ok' });
        render(<JobsStatusChart />);

        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('Hiba történt az adatok betöltése közben.');
        expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
    });

    it('renders the chart title correctly when data is loaded', () => {
        useFetch.mockReturnValue({ data: null, isLoading: false, error: null });
        render(<JobsStatusChart />);

        expect(screen.getByText('Munkák állapota')).toBeInTheDocument();
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null, isLoading: false, error: null });
        render(<JobsStatusChart />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/jobs-status');
    });

    it('renders chart data correctly when data is fetched', () => {
        const mockData = [
            { status: 'completed', label: 'Lezárt', count: 12 },
            { status: 'pending', label: 'Folyamatban', count: 5 }
        ];

        useFetch.mockReturnValue({ data: mockData, isLoading: false, error: null });
        render(<JobsStatusChart />);

        expect(screen.getByText('Lezárt')).toBeInTheDocument();
        expect(screen.getByText('Folyamatban')).toBeInTheDocument();
    });

    it('renders without crashing when data is empty array', () => {
        useFetch.mockReturnValue({ data: [], isLoading: false, error: null });
        const { container } = render(<JobsStatusChart />);

        expect(container.querySelector('.jobs-status-card')).toBeInTheDocument();
    });

    it('formats the tooltip value correctly', () => {
        useFetch.mockReturnValue({ data: [], isLoading: false, error: null });
        render(<JobsStatusChart />);

        expect(screen.getByTestId('mock-tooltip')).toHaveTextContent('5 db');
    });
});