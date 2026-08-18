const authService = require('../services/authService');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const token = authHeader.slice(7);

    try {
        const decoded = authService.verifyToken(token);

        if (!authService.ALLOWED_ROLES.has(decoded.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            mustChangePassword: decoded.mustChangePassword,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = {
    authenticate,
};