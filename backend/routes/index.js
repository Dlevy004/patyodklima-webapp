const express = require('express');
const clientRoutes = require('./clientRoutes');


const router = express.Router();

router.use(clientRoutes);

module.exports = router;