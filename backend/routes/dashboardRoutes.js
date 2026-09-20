const express = require('express');

const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard/overview', authenticate, dashboardController.getOverview);
router.get('/dashboard/monthly-revenue', authenticate, dashboardController.getMonthlyRevenue);
router.get('/dashboard/revenue-by-category', authenticate, dashboardController.getRevenueByCategory);
router.get('/dashboard/top-ac-units', authenticate, dashboardController.getTopAcUnits);
router.get('/dashboard/top-cities', authenticate, dashboardController.getTopCities);
router.get('/dashboard/recent-activity', authenticate, dashboardController.getRecentActivity);

module.exports = router;