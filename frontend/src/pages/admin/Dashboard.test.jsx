import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Dashboard from './Dashboard';
import usePageTitle from '@/hooks/usePageTitle';

vi.mock('@/hooks/usePageTitle');

vi.mock('@/components/admin/dashboard/RecentActivity', () => ({
    default: () => <div data-testid="mock-recent-activity">RecentActivity</div>
}));
vi.mock('@/components/admin/dashboard/StatCard', () => ({
    default: () => <div data-testid="mock-stat-card">StatCard</div>
}));
vi.mock('@/components/admin/dashboard/MonthlyRevenueChart', () => ({
    default: () => <div data-testid="mock-monthly-revenue">MonthlyRevenueChart</div>
}));
vi.mock('@/components/admin/dashboard/RevenueByCategoryChart', () => ({
    default: () => <div data-testid="mock-revenue-category">RevenueByCategoryChart</div>
}));
vi.mock('@/components/admin/dashboard/TopAcUnitsChart', () => ({
    default: () => <div data-testid="mock-top-ac-units">TopAcUnitsChart</div>
}));
vi.mock('@/components/admin/dashboard/TopCitiesChart', () => ({
    default: () => <div data-testid="mock-top-cities">TopCitiesChart</div>
}));
vi.mock('@/components/admin/dashboard/JobsStatusChart', () => ({
    default: () => <div data-testid="mock-jobs-status">JobsStatusChart</div>
}));
vi.mock('@/components/common/ScrollUp', () => ({
    default: () => <div data-testid="mock-scroll-up">ScrollUp</div>
}));


describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sets the page title using usePageTitle hook', () => {
        render(<Dashboard />);
        expect(usePageTitle).toHaveBeenCalledWith('Főoldal');
    });

    it('renders all dashboard components correctly', () => {
        render(<Dashboard />);

        expect(screen.getByTestId('mock-recent-activity')).toBeInTheDocument();
        expect(screen.getByTestId('mock-stat-card')).toBeInTheDocument();
        expect(screen.getByTestId('mock-monthly-revenue')).toBeInTheDocument();
        expect(screen.getByTestId('mock-revenue-category')).toBeInTheDocument();
        expect(screen.getByTestId('mock-top-ac-units')).toBeInTheDocument();
        expect(screen.getByTestId('mock-top-cities')).toBeInTheDocument();
        expect(screen.getByTestId('mock-jobs-status')).toBeInTheDocument();
        expect(screen.getByTestId('mock-scroll-up')).toBeInTheDocument();
    });
});