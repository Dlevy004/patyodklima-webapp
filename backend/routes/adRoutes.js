const express = require('express');
const multer = require('multer');

const adController = require('../controllers/adController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
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
            return res.status(400).json({ message: 'Hiba történt a fájl feltöltése során.' });
        }

        return res.status(400).json({ message: err.message || 'Csak képfájl tölthető fel.' });
    });
};

router.get('/ad-templates', authenticate, adController.getTemplates);
router.get('/ad-ac-units', authenticate, adController.getAdAcUnits);
router.get('/ads', authenticate, adController.getAllAds);
router.get('/ads/:id/download', authenticate, adController.downloadAd);
router.post('/ads/generate', authenticate, handleUpload, adController.generateAd);
router.delete('/ads/:id', authenticate, adController.deleteAd);

module.exports = router;