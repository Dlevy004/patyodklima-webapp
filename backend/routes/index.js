const express = require('express');
const router = express.Router();
const clientRoutes = require('./clientRoutes');

router.use(clientRoutes);

module.exports = router;