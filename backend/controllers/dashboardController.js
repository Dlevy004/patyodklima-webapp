const dashboardService = require('../services/dashboardService');

const getOverview = async (_req, res) => {
    try {
        const stats = await dashboardService.getOverviewStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error while getting dashboard overview:', error.message);
        res.status(500).json({ message: 'Hiba történt az áttekintő statisztikák lekérése közben.' });
    }
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const year = Number.parseInt(req.query.year, 10) || new Date().getFullYear();
        const data = await dashboardService.getMonthlyRevenue(year);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error while getting monthly revenue:', error.message);
        res.status(500).json({ message: 'Hiba történt a havi bevétel lekérése közben.' });
    }
};

const getRevenueByCategory = async (req, res) => {
    try {
        const year = req.query.year ? Number.parseInt(req.query.year, 10) : null;
        const data = await dashboardService.getRevenueByCategory(year);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error while getting revenue by category:', error.message);
        res.status(500).json({ message: 'Hiba történt a kategóriánkénti bevétel lekérése közben.' });
    }
};

const getTopAcUnits = async (req, res) => {
    try {
        const limit = Number.parseInt(req.query.limit, 10) || 5;
        const data = await dashboardService.getTopAcUnits(limit);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error while getting top AC units:', error.message);
        res.status(500).json({ message: 'Hiba történt a legnépszerűbb modellek lekérése közben.' });
    }
};

const getTopCities = async (req, res) => {
    try {
        const limit = Number.parseInt(req.query.limit, 10) || 5;
        const data = await dashboardService.getTopCities(limit);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error while getting top cities:', error.message);
        res.status(500).json({ message: 'Hiba történt a legnépszerűbb települések lekérése közben.' });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const days = Number.parseInt(req.query.days, 10) || 7;
        const data = await dashboardService.getRecentActivity(days);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error while getting recent activity:', error.message);
        res.status(500).json({ message: 'Hiba történt a legutóbbi aktivitás lekérése közben.' });
    }
};

module.exports = {
    getOverview,
    getMonthlyRevenue,
    getRevenueByCategory,
    getTopAcUnits,
    getTopCities,
    getRecentActivity
};