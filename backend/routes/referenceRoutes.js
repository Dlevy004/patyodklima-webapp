const express = require('express');
const multer = require('multer');
const referenceController = require('../controllers/referenceController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/references', upload.single('image'), referenceController.createReference);
router.get('/references', referenceController.getAllReferences);
router.get('/references/:id', referenceController.getReferenceById);
router.put('/references/:id', referenceController.updateReference);
router.delete('/references/:id', referenceController.deleteReference);

module.exports = router;