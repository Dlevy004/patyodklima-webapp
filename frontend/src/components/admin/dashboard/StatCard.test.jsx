import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import StatCard from './StatCard';
import useFetch from '../../../hooks/useFetch';

vi.mock('../../../hooks/useFetch');

describe('StatCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null });
        render(<StatCard />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/overview');
    });

    it('renders the stat titles correctly', () => {
        useFetch.mockReturnValue({ data: null });
        render(<StatCard />);

        expect(screen.getAllByText('Összes ügyfél').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Összes bevétel').length).toBeGreaterThan(0);
    });

    it('renders placeholder dots when data is null', () => {
        useFetch.mockReturnValue({ data: null });
        render(<StatCard />);

        const placeholders = screen.getAllByText('…');
        expect(placeholders.length).toBe(12);
    });

    it('formats and renders numbers and currency correctly when data is fetched', () => {
        const mockData = {
            totalClients: 150,
            totalRevenue: 1200000,
            totalInstallations: 45,
            totalVisualDesigns: 12,
            averageMonthlyRevenue: 300000,
            monthlyDispatches: 8
        };

        useFetch.mockReturnValue({ data: mockData });
        render(<StatCard />);

        expect(screen.getAllByText('150').length).toBe(2);
        expect(screen.getAllByText('45').length).toBe(2);

        const revenueElements = screen.getAllByText(/1.*200.*000.*Ft/);
        expect(revenueElements.length).toBe(2);
    });

    it('handles missing values gracefully by defaulting to 0', () => {
        useFetch.mockReturnValue({ data: {} });
        render(<StatCard />);

        const zeroElements = screen.getAllByText('0');
        expect(zeroElements.length).toBe(8);

        const zeroCurrencyElements = screen.getAllByText(/0.*Ft/);
        expect(zeroCurrencyElements.length).toBe(4);
    });
});