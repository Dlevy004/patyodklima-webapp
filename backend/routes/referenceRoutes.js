const express = require('express');
const multer = require('multer');
const referenceController = require('../controllers/referenceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1, fields: 5, fieldSize: 16 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            const error = new Error('Csak JPEG, PNG, WebP vagy AVIF kép tölthető fel.');
            error.code = 'INVALID_IMAGE_TYPE';
            return callback(error);
        }
        callback(null, true);
    }
});

const handleReferenceUpload = (req, res, next) => {
    upload.single('image')(req, res, (error) => {
        if (!error) return next();

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'A kép mérete legfeljebb 10 MB lehet.' });
        }

        if (error.code === 'INVALID_IMAGE_TYPE') {
            return res.status(415).json({ message: error.message });
        }

        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Érvénytelen fájlfeltöltési kérés.' });
        }

        next(error);
    });
};

router.get('/references', referenceController.getPublicReferences);

router.get('/references/admin', authenticate, referenceController.getAllReferences);

router.get('/references/:id', authenticate, referenceController.getReferenceById);

router.post('/references', authenticate, handleReferenceUpload, referenceController.createReference);
router.put('/references/:id', authenticate, referenceController.updateReference);
router.delete('/references/:id', authenticate, referenceController.deleteReference);
router.get('/references/:id/download', authenticate, referenceController.downloadReference);

module.exports = router;