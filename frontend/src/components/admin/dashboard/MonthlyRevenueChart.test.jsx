import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import MonthlyRevenueChart from './MonthlyRevenueChart';
import useFetch from '@/hooks/useFetch';
import useIsMobile from '@/hooks/useIsMobile';

vi.mock('@/hooks/useFetch');
vi.mock('@/hooks/useIsMobile');

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="mock-responsive-container">{children}</div>,
    BarChart: ({ children, data }) => (
        <div data-testid="mock-bar-chart">
            {data?.map((entry, index) => (
                <span key={index}>{entry.label}</span>
            ))}
            {children}
        </div>
    ),
    Bar: () => null,
    CartesianGrid: () => null,

    XAxis: ({ tickFormatter }) => (
        <div data-testid="mock-xaxis">
            <span data-testid="xaxis-tick-1">{tickFormatter ? tickFormatter('Január') : null}</span>
            <span data-testid="xaxis-tick-2">{tickFormatter ? tickFormatter('Ismeretlen') : null}</span>
        </div>
    ),

    YAxis: ({ tickFormatter }) => (
        <div data-testid="mock-yaxis">
            {tickFormatter ? tickFormatter(5000) : null}
        </div>
    ),

    Tooltip: ({ formatter, labelFormatter }) => (
        <div data-testid="mock-tooltip">
            <span data-testid="tooltip-val-1">{formatter ? formatter(500, 'installation').join(' | ') : null}</span>
            <span data-testid="tooltip-val-2">{formatter ? formatter(500, 'unknown_cat').join(' | ') : null}</span>
            <span data-testid="tooltip-label">{labelFormatter ? labelFormatter('Február') : null}</span>
        </div>
    ),

    Legend: ({ formatter }) => (
        <div data-testid="mock-legend">
            {formatter ? formatter('maintenance') : null}
        </div>
    ),
}));

describe('MonthlyRevenueChart', () => {
    const currentYear = new Date().getFullYear();

    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
        useIsMobile.mockReturnValue(false);
    });

    it('renders the chart title with the current year', () => {
        useFetch.mockReturnValue({ data: null });
        render(<MonthlyRevenueChart />);

        expect(screen.getByText(`Havi bevétel - ${currentYear}`)).toBeInTheDocument();
    });

    it('calls useFetch with the correct URL including the current year', () => {
        useFetch.mockReturnValue({ data: null });
        render(<MonthlyRevenueChart />);

        expect(useFetch).toHaveBeenCalledWith(`http://localhost:3000/api/dashboard/monthly-revenue?year=${currentYear}`);
    });

    it('renders chart data labels correctly when data is fetched', () => {
        const mockData = [
            { month: 1, installation: 10000 },
            { month: 8, maintenance: 5000 }
        ];

        useFetch.mockReturnValue({ data: mockData });
        render(<MonthlyRevenueChart />);

        expect(screen.getAllByText('Január').length).toBeGreaterThan(0);

        expect(screen.getByText('Augusztus')).toBeInTheDocument();
    });

    it('renders safely when API returns empty array or null', () => {
        useFetch.mockReturnValue({ data: [] });
        const { container } = render(<MonthlyRevenueChart />);

        expect(container.querySelector('.monthly-revenue-card')).toBeInTheDocument();
    });

    it('formats axes, tooltips, and legends correctly on desktop', () => {
        useFetch.mockReturnValue({ data: [] });
        render(<MonthlyRevenueChart />);

        expect(screen.getByTestId('mock-yaxis')).toHaveTextContent('5E');

        expect(screen.getByTestId('xaxis-tick-1')).toHaveTextContent('Január');

        expect(screen.getByTestId('mock-legend')).toHaveTextContent('Karbantartás');

        expect(screen.getByTestId('tooltip-val-1')).toHaveTextContent('500 Ft | Telepítés');
        expect(screen.getByTestId('tooltip-val-2')).toHaveTextContent('500 Ft | unknown_cat');
        expect(screen.getByTestId('tooltip-label')).toHaveTextContent('Február');
    });

    it('formats XAxis ticks correctly on mobile', () => {
        useIsMobile.mockReturnValue(true);
        useFetch.mockReturnValue({ data: [] });
        render(<MonthlyRevenueChart />);

        expect(screen.getByTestId('xaxis-tick-1')).toHaveTextContent('Jan');

        expect(screen.getByTestId('xaxis-tick-2')).toHaveTextContent('Ismeretlen');
    });

    it('renders the loading state when isLoading is true', () => {
        useFetch.mockReturnValue({ data: null, error: null, isLoading: true });
        render(<MonthlyRevenueChart />);

        expect(screen.getByText('Betöltés…')).toBeInTheDocument();
        expect(screen.getByText(`Havi bevétel - ${currentYear}`)).toBeInTheDocument();
    });

    it('renders the error state with role="alert" when an error occurs', () => {
        useFetch.mockReturnValue({ data: null, error: new Error('Network error'), isLoading: false });
        render(<MonthlyRevenueChart />);

        const alertMessage = screen.getByRole('alert');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Hiba történt az adatok betöltése közben.');
        expect(screen.getByText(`Havi bevétel - ${currentYear}`)).toBeInTheDocument();
    });
});