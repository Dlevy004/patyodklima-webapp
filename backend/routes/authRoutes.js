const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Túl sok bejelentkezési kísérlet. Próbáld újra később.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/login', loginLimiter, authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.post('/auth/change-password', authenticate, authController.changePassword);

router.put('/auth/profile', authenticate, upload.single('profileImage'), authController.updateProfile);

module.exports = router;