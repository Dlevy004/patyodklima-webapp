const prisma = require('../database/prisma');

const dashboardService = require('../services/dashboardService');
const { normalizeText } = require('../utils/textNormalize');

jest.mock('../database/prisma', () => ({
    clients: {
        count: jest.fn(),
        findMany: jest.fn()
    },
    jobs: {
        count: jest.fn(),
        findMany: jest.fn()
    },
    ai_visual_designs: {
        count: jest.fn(),
        findMany: jest.fn()
    },
    generated_ads: {
        findMany: jest.fn()
    }
}));

jest.mock('../utils/textNormalize', () => ({
    normalizeText: jest.fn()
}));


describe('Dashboard Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOverviewStats', () => {
        it('should aggregate revenue by month and compute the correct average', async () => {
            prisma.clients.count.mockResolvedValue(12);
            prisma.jobs.count
                .mockResolvedValueOnce(4)
                .mockResolvedValueOnce(2);
            prisma.ai_visual_designs.count.mockResolvedValue(6);
            prisma.jobs.findMany.mockResolvedValue([
                { job_date: '2026-01-15T00:00:00Z', total_amount: 100 },
                { job_date: '2026-01-20T00:00:00Z', total_amount: 50 },
                { job_date: '2026-02-05T00:00:00Z', total_amount: 300 }
            ]);

            const result = await dashboardService.getOverviewStats();

            expect(result.totalClients).toBe(12);
            expect(result.totalInstallations).toBe(4);
            expect(result.totalVisualDesigns).toBe(6);
            expect(result.monthlyDispatches).toBe(2);
            expect(result.totalRevenue).toBe(450);
            // 2026-01: 150, 2026-02: 300 -> average = 225
            expect(result.averageMonthlyRevenue).toBe(225);
        });

        it('should return an average of 0 when there are no jobs at all', async () => {
            prisma.clients.count.mockResolvedValue(0);
            prisma.jobs.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
            prisma.ai_visual_designs.count.mockResolvedValue(0);
            prisma.jobs.findMany.mockResolvedValue([]);

            const result = await dashboardService.getOverviewStats();

            expect(result.totalRevenue).toBe(0);
            expect(result.averageMonthlyRevenue).toBe(0);
        });
    });

    describe('getMonthlyRevenue', () => {
        it('should bucket jobs into the correct month and category, and query the given year range', async () => {
            prisma.jobs.findMany.mockResolvedValue([
                { job_date: '2026-03-10T00:00:00Z', category: 'installation', total_amount: 100 },
                { job_date: '2026-03-15T00:00:00Z', category: 'installation', total_amount: 50 },
                { job_date: '2026-06-01T00:00:00Z', category: 'unknown_category', total_amount: 20 }
            ]);

            const result = await dashboardService.getMonthlyRevenue(2026);

            expect(prisma.jobs.findMany).toHaveBeenCalledWith({
                where: {
                    job_date: {
                        gte: new Date('2026-01-01'),
                        lt: new Date('2027-01-01')
                    }
                },
                select: { job_date: true, category: true, total_amount: true }
            });

            expect(result).toHaveLength(12);
            expect(result[2]).toMatchObject({ month: 3, installation: 150 });
            expect(result[5]).toMatchObject({ month: 6, other: 20 });
        });

        it('should return 12 zeroed-out months when there are no jobs', async () => {
            prisma.jobs.findMany.mockResolvedValue([]);

            const result = await dashboardService.getMonthlyRevenue(2026);

            expect(result).toHaveLength(12);
            result.forEach((month, index) => {
                expect(month).toEqual({
                    month: index + 1,
                    installation: 0,
                    maintenance: 0,
                    survey: 0,
                    cleaning: 0,
                    other: 0
                });
            });
        });
    });

    describe('getRevenueByCategory', () => {
        it('should query without a date filter when no year is given', async () => {
            prisma.jobs.findMany.mockResolvedValue([]);

            await dashboardService.getRevenueByCategory();

            expect(prisma.jobs.findMany).toHaveBeenCalledWith({
                where: {},
                select: { category: true, total_amount: true }
            });
        });

        it('should query with a date range filter when a year is given', async () => {
            prisma.jobs.findMany.mockResolvedValue([]);

            await dashboardService.getRevenueByCategory(2026);

            expect(prisma.jobs.findMany).toHaveBeenCalledWith({
                where: {
                    job_date: {
                        gte: new Date('2026-01-01'),
                        lt: new Date('2027-01-01')
                    }
                },
                select: { category: true, total_amount: true }
            });
        });

        it('should sum totals per known category and fall back unknown categories to "other"', async () => {
            prisma.jobs.findMany.mockResolvedValue([
                { category: 'installation', total_amount: 100 },
                { category: 'installation', total_amount: 50 },
                { category: 'cleaning', total_amount: 30 },
                { category: 'something_else', total_amount: 10 }
            ]);

            const result = await dashboardService.getRevenueByCategory(2026);

            expect(result).toEqual(
                expect.arrayContaining([
                    { category: 'installation', label: 'Telepítés', total: 150 },
                    { category: 'cleaning', label: 'Takarítás', total: 30 },
                    { category: 'other', label: 'Egyéb', total: 10 }
                ])
            );
        });
    });

    describe('getTopAcUnits', () => {
        it('should skip entries that normalize to null, count duplicates, and sort descending', async () => {
            prisma.jobs.findMany.mockResolvedValue([
                { ac_unit: 'ande' },
                { ac_unit: 'Ande' },
                { ac_unit: 'aux' },
                { ac_unit: '   ' },
            ]);

            normalizeText.mockImplementation((value) => {
                if (!value || !value.trim()) return null;
                return value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
            });

            const result = await dashboardService.getTopAcUnits();

            expect(result).toEqual([
                { name: 'Ande', count: 2 },
                { name: 'Aux', count: 1 }
            ]);
        });

        it('should respect the given limit', async () => {
            prisma.jobs.findMany.mockResolvedValue([
                { ac_unit: 'A' }, { ac_unit: 'B' }, { ac_unit: 'C' }
            ]);
            normalizeText.mockImplementation((value) => value);

            const result = await dashboardService.getTopAcUnits(2);

            expect(result).toHaveLength(2);
        });
    });

    describe('getTopCities', () => {
        it('should skip entries that normalize to null, count duplicates, and sort descending', async () => {
            prisma.clients.findMany.mockResolvedValue([
                { city: 'budapest' },
                { city: 'Budapest' },
                { city: 'debrecen' },
                { city: null },
            ]);

            normalizeText.mockImplementation((value) => {
                if (!value || !value.trim()) return null;
                return value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
            });

            const result = await dashboardService.getTopCities();

            expect(result).toEqual([
                { name: 'Budapest', count: 2 },
                { name: 'Debrecen', count: 1 }
            ]);
        });

        it('should respect the given limit', async () => {
            prisma.clients.findMany.mockResolvedValue([
                { city: 'A' }, { city: 'B' }, { city: 'C' }
            ]);
            normalizeText.mockImplementation((value) => value);

            const result = await dashboardService.getTopCities(1);

            expect(result).toHaveLength(1);
        });
    });

    describe('getRecentActivity', () => {
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2026-09-15T12:00:00Z'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should build 7 day-buckets by default, correctly tallying each activity type', async () => {
            prisma.clients.findMany.mockResolvedValue([
                { created_at: '2026-09-15T08:00:00Z' },
                { created_at: '2026-09-15T09:00:00Z' }
            ]);
            prisma.jobs.findMany
                .mockResolvedValueOnce([{ created_at: '2026-09-14T08:00:00Z' }]) // newJobs
                .mockResolvedValueOnce([{ job_date: '2026-09-13T08:00:00Z' }]); // completedJobs
            prisma.ai_visual_designs.findMany.mockResolvedValue([
                { created_at: '2026-09-15T10:00:00Z' }
            ]);
            prisma.generated_ads.findMany.mockResolvedValue([
                { created_at: '2026-09-09T10:00:00Z' }
            ]);

            const result = await dashboardService.getRecentActivity();

            expect(result).toHaveLength(7);

            const sept15 = result.find((day) => day.date === '2026-09-15');
            expect(sept15.newClients).toBe(2);
            expect(sept15.newVisualDesigns).toBe(1);

            const sept14 = result.find((day) => day.date === '2026-09-14');
            expect(sept14.newJobs).toBe(1);

            const sept13 = result.find((day) => day.date === '2026-09-13');
            expect(sept13.completedJobs).toBe(1);

            const sept09 = result.find((day) => day.date === '2026-09-09');
            expect(sept09.newAds).toBe(1);
        });

        it('should respect a custom "days" window', async () => {
            prisma.clients.findMany.mockResolvedValue([]);
            prisma.jobs.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
            prisma.ai_visual_designs.findMany.mockResolvedValue([]);
            prisma.generated_ads.findMany.mockResolvedValue([]);

            const result = await dashboardService.getRecentActivity(3);

            expect(result).toHaveLength(3);
            expect(result.map((d) => d.date)).toEqual(['2026-09-15', '2026-09-14', '2026-09-13']);
        });

        it('should sort the returned days in descending (most recent first) order', async () => {
            prisma.clients.findMany.mockResolvedValue([]);
            prisma.jobs.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
            prisma.ai_visual_designs.findMany.mockResolvedValue([]);
            prisma.generated_ads.findMany.mockResolvedValue([]);

            const result = await dashboardService.getRecentActivity(3);

            const dates = result.map((d) => d.date);
            const sortedDescending = [...dates].sort().reverse();
            expect(dates).toEqual(sortedDescending);
        });

        it('should silently ignore rows whose date falls outside the generated day-buckets (all five sources)', async () => {
            const outOfRange = '2020-01-01T00:00:00Z';

            prisma.clients.findMany.mockResolvedValue([{ created_at: outOfRange }]);
            prisma.jobs.findMany
                .mockResolvedValueOnce([{ created_at: outOfRange }]) // newJobs
                .mockResolvedValueOnce([{ job_date: outOfRange }]); // completedJobs
            prisma.ai_visual_designs.findMany.mockResolvedValue([{ created_at: outOfRange }]);
            prisma.generated_ads.findMany.mockResolvedValue([{ created_at: outOfRange }]);

            const result = await dashboardService.getRecentActivity(3);

            const totals = result.reduce(
                (acc, day) => ({
                    newClients: acc.newClients + day.newClients,
                    newJobs: acc.newJobs + day.newJobs,
                    completedJobs: acc.completedJobs + day.completedJobs,
                    newVisualDesigns: acc.newVisualDesigns + day.newVisualDesigns,
                    newAds: acc.newAds + day.newAds
                }),
                { newClients: 0, newJobs: 0, completedJobs: 0, newVisualDesigns: 0, newAds: 0 }
            );

            expect(totals).toEqual({
                newClients: 0,
                newJobs: 0,
                completedJobs: 0,
                newVisualDesigns: 0,
                newAds: 0
            });
        });
    });

    describe('getJobsStatus', () => {
        it('should return the completed and pending counts with the correct labels', async () => {
            prisma.jobs.count
                .mockResolvedValueOnce(8) // completed
                .mockResolvedValueOnce(3); // pending

            const result = await dashboardService.getJobsStatus();

            expect(prisma.jobs.count).toHaveBeenNthCalledWith(1, { where: { is_completed: true } });
            expect(prisma.jobs.count).toHaveBeenNthCalledWith(2, { where: { is_completed: false } });

            expect(result).toEqual([
                { status: 'completed', label: 'Lezárt', count: 8 },
                { status: 'pending', label: 'Folyamatban', count: 3 }
            ]);
        });
    });
});