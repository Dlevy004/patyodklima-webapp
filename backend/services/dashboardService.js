const prisma = require('../database/prisma');
const { normalizeText } = require('../utils/textNormalize');


const CATEGORY_LABELS = {
    installation: 'Telepítés',
    maintenance: 'Karbantartás',
    survey: 'Felmérés',
    cleaning: 'Takarítás',
    other: 'Egyéb'
};

const getBucket = (category) => (CATEGORY_LABELS[category] ? category : 'other');

const getOverviewStats = async () => {
    const [totalClients, totalInstallations, totalVisualDesigns, allJobs, monthlyDispatches] = await Promise.all([
        prisma.clients.count(),
        prisma.jobs.count({ where: { category: 'installation' } }),
        prisma.ai_visual_designs.count({ where: { status: 'completed' } }),
        prisma.jobs.findMany({ select: { job_date: true, total_amount: true } }),
        prisma.jobs.count({
            where: {
                job_date: {
                    gte: (() => {
                        const startOfMonth = new Date();
                        startOfMonth.setDate(1);
                        startOfMonth.setHours(0, 0, 0, 0);
                        return startOfMonth;
                    })()
                }
            }
        })
    ]);

    const totalRevenue = allJobs.reduce((sum, job) => sum + job.total_amount, 0);

    const revenueByMonth = {};
    allJobs.forEach((job) => {
        const monthKey = new Date(job.job_date).toISOString().slice(0, 7);
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + job.total_amount;
    });
    const monthlyTotals = Object.values(revenueByMonth);
    const averageMonthlyRevenue = monthlyTotals.length
        ? Math.round(monthlyTotals.reduce((sum, total) => sum + total, 0) / monthlyTotals.length)
        : 0;

    return {
        totalClients,
        totalInstallations,
        totalVisualDesigns,
        totalRevenue,
        averageMonthlyRevenue,
        monthlyDispatches
    };
};

const getMonthlyRevenue = async (year) => {
    const jobs = await prisma.jobs.findMany({
        where: {
            job_date: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`)
            }
        },
        select: { job_date: true, category: true, total_amount: true }
    });

    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        installation: 0,
        maintenance: 0,
        survey: 0,
        cleaning: 0,
        other: 0
    }));

    jobs.forEach((job) => {
        const monthIndex = new Date(job.job_date).getUTCMonth();
        const bucket = getBucket(job.category);
        months[monthIndex][bucket] += job.total_amount;
    });

    return months;
};

const getRevenueByCategory = async (year = null) => {
    const where = year
        ? {
              job_date: {
                  gte: new Date(`${year}-01-01`),
                  lt: new Date(`${year + 1}-01-01`)
              }
          }
        : {};

    const jobs = await prisma.jobs.findMany({
        where,
        select: { category: true, total_amount: true }
    });

    const totals = {};
    jobs.forEach((job) => {
        const bucket = getBucket(job.category);
        totals[bucket] = (totals[bucket] || 0) + job.total_amount;
    });

    return Object.entries(totals).map(([category, total]) => ({
        category,
        label: CATEGORY_LABELS[category],
        total
    }));
};

const getTopAcUnits = async (limit = 5) => {
    const jobs = await prisma.jobs.findMany({
        where: { ac_unit: { not: null } },
        select: { ac_unit: true }
    });

    const counts = {};
    jobs.forEach((job) => {
        const normalized = normalizeText(job.ac_unit);
        if (!normalized) return;
        counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

const getTopCities = async (limit = 5) => {
    const clients = await prisma.clients.findMany({
        where: { city: { not: null } },
        select: { city: true }
    });

    const counts = {};
    clients.forEach((client) => {
        const normalized = normalizeText(client.city);
        if (!normalized) return;
        counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

const getRecentActivity = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const [newClients, newJobs, completedJobs, newVisualDesigns, newAds] = await Promise.all([
        prisma.clients.findMany({
            where: { created_at: { gte: startDate } },
            select: { created_at: true }
        }),
        prisma.jobs.findMany({
            where: { created_at: { gte: startDate } },
            select: { created_at: true }
        }),
        prisma.jobs.findMany({
            where: { is_completed: true, job_date: { gte: startDate } },
            select: { job_date: true }
        }),
        prisma.ai_visual_designs.findMany({
            where: { created_at: { gte: startDate }, status: 'completed' },
            select: { created_at: true }
        }),
        prisma.generated_ads.findMany({
            where: { created_at: { gte: startDate } },
            select: { created_at: true }
        })
    ]);

    const toDateKey = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const dayBuckets = {};
    for (let i = 0; i < days; i += 1) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const key = toDateKey(date);
        dayBuckets[key] = {
            date: key,
            newClients: 0,
            newJobs: 0,
            completedJobs: 0,
            newVisualDesigns: 0,
            newAds: 0
        };
    }

    newClients.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (dayBuckets[key]) dayBuckets[key].newClients += 1;
    });

    newJobs.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (dayBuckets[key]) dayBuckets[key].newJobs += 1;
    });

    completedJobs.forEach((row) => {
        const key = toDateKey(row.job_date);
        if (dayBuckets[key]) dayBuckets[key].completedJobs += 1;
    });

    newVisualDesigns.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (dayBuckets[key]) dayBuckets[key].newVisualDesigns += 1;
    });

    newAds.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (dayBuckets[key]) dayBuckets[key].newAds += 1;
    });

    return Object.values(dayBuckets).sort((a, b) => (a.date < b.date ? 1 : -1));
};

const getJobsStatus = async () => {
    const [completed, pending] = await Promise.all([
        prisma.jobs.count({ where: { is_completed: true } }),
        prisma.jobs.count({ where: { is_completed: false } })
    ]);

    return [
        { status: 'completed', label: 'Lezárt', count: completed },
        { status: 'pending', label: 'Folyamatban', count: pending }
    ];
};

module.exports = {
    getOverviewStats,
    getMonthlyRevenue,
    getRevenueByCategory,
    getTopAcUnits,
    getTopCities,
    getRecentActivity,
    getJobsStatus
};