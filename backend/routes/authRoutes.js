const express = require('express');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Túl sok bejelentkezési kísérlet. Próbáld újra később.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/login', loginLimiter, authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.post('/auth/change-password', authenticate, authController.changePassword);

module.exports = router;