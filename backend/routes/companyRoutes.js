const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');
const { authenticate } = require('../middleware/authMiddleware');


router.get('/company', authenticate, companyController.getCompanyData);
router.put('/company', authenticate, companyController.updateCompanyData);

module.exports = router;