const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.createClient);
router.get('/clients', clientController.getAllClients);
router.get('/client/:id', clientController.getClientById);

module.exports = router;