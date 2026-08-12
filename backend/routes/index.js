const express = require('express');
const clientRoutes = require('./clientRoutes');
const referenceRoutes = require('./referenceRoutes');


const router = express.Router();

router.use(clientRoutes);
router.use(referenceRoutes);

module.exports = router;