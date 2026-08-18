const express = require('express');
const multer = require('multer');
const referenceController = require('../controllers/referenceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/references', referenceController.getAllReferences);
router.get('/references/:id', referenceController.getReferenceById);

router.post('/references', authenticate, upload.single('image'), referenceController.createReference);
router.put('/references/:id', authenticate, referenceController.updateReference);
router.delete('/references/:id', authenticate, referenceController.deleteReference);

module.exports = router;