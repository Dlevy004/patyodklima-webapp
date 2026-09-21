import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import RecentActivity from './RecentActivity';
import useFetch from '../../../hooks/useFetch';

vi.mock('../../../hooks/useFetch');


describe('RecentActivity', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        import.meta.env.VITE_API_URL = 'http://localhost:3000';
    });

    it('calls useFetch with the correct URL', () => {
        useFetch.mockReturnValue({ data: null });
        render(<RecentActivity />);

        expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/recent-activity?days=1');
    });

    it('displays loading message when data is not yet available', () => {
        useFetch.mockReturnValue({ data: null });
        render(<RecentActivity />);

        expect(screen.getByText('Legutóbbi aktivitás betöltése…')).toBeInTheDocument();
    });

    it('displays the correct message when activity data is fetched', () => {
        const mockData = [{
            newJobs: 3,
            newClients: 2,
            completedJobs: 1,
            newVisualDesigns: 4,
            newAds: 0
        }];

        useFetch.mockReturnValue({ data: mockData });
        render(<RecentActivity />);

        const expectedMessage = 'Legutóbbi aktivitás: 3 új munka, 2 új ügyfél, 1 lezárt munka, 4 új látványterv, 0 új hirdetés';
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });
});