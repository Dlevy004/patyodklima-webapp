const express = require('express');
const multer = require('multer');

const visualDesignController = require('../controllers/visualDesignController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mask', maxCount: 1 }
]);

router.post('/visual-designs/generate', authenticate, cpUpload, visualDesignController.generateDesign);

module.exports = router;