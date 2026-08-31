const express = require('express');

const authRoutes = require('./authRoutes');
const { authenticate } = require('../middleware/authMiddleware');
const clientRoutes = require('./clientRoutes');
const referenceRoutes = require('./referenceRoutes');
const jobRoutes = require('./jobRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(referenceRoutes);
router.use(authenticate);
router.use(clientRoutes);
router.use(jobRoutes);

module.exports = router;