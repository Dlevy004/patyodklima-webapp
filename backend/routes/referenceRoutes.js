const express = require('express');
const referenceController = require('../controllers/referenceController');

const router = express.Router();


router.post('/references', referenceController.createReference);

router.get('/references', referenceController.getAllReferences);
router.get('/references/:id', referenceController.getReferenceById);

router.put('/references/:id', referenceController.updateReference);

router.delete('/references/:id', referenceController.deleteReference);

module.exports = router;