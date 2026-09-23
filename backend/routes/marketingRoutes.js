const express = require('express');
const multer = require('multer');

const marketingController = require('../controllers/marketingController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
        fields: 20,
        parts: 25
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Csak képfájl tölthető fel.'));
        }
        cb(null, true);
    }
});

const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'A feltöltött fájl mérete túl nagy (max. 10 MB).' });
            }

            console.error('Multer validation error:', err.code, err.message);
            return res.status(400).json({ message: 'Hiba történt a fájl feltöltése során.' });
        }

        console.error('Unexpected upload error:', err.message);
        return res.status(400).json({ message: 'Csak képfájl tölthető fel.' });
    });
};

router.get('/marketing-templates', authenticate, marketingController.getTemplates);
router.get('/marketing-ac-units', authenticate, marketingController.getMarketingAcUnits);
router.get('/marketings', authenticate, marketingController.getAllMarketings);
router.get('/marketings/:id/download', authenticate, marketingController.downloadMarketing);
router.post('/marketings/generate', authenticate, handleUpload, marketingController.generateMarketing);
router.delete('/marketings/:id', authenticate, marketingController.deleteMarketing);

module.exports = router;