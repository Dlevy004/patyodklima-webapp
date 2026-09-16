const express = require('express');

const authRoutes = require('./authRoutes');
const { authenticate } = require('../middleware/authMiddleware');
const clientRoutes = require('./clientRoutes');
const referenceRoutes = require('./referenceRoutes');
const jobRoutes = require('./jobRoutes');
const companyRoutes = require('./companyRoutes');
const visualDesignRoutes = require('./visualDesignRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(referenceRoutes);

router.use(authenticate);
router.use(clientRoutes);
router.use(jobRoutes);
router.use(companyRoutes);
router.use(visualDesignRoutes);

module.exports = router;