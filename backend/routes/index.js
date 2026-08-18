const express = require('express');

const authRoutes = require('./authRoutes');
const { authenticate } = require('../middleware/authMiddleware');
const clientRoutes = require('./clientRoutes');
const referenceRoutes = require('./referenceRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(referenceRoutes);
router.use(authenticate);
router.use(clientRoutes);

module.exports = router;