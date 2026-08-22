const { authenticate } = require('../middleware/authMiddleware');
const authService = require('../services/authService');

jest.mock('../services/authService', () => ({
    verifyToken: jest.fn(),
    ALLOWED_ROLES: new Set(['admin', 'developer']),
}));

describe('authenticate middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should reject requests without authorization header', () => {
        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hitelesítés szükséges.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should attach user data for valid tokens', () => {
        req.headers.authorization = 'Bearer valid-token';
        authService.verifyToken.mockReturnValue({
            sub: 'user-1',
            email: 'admin@patyodklima.hu',
            role: 'admin',
            mustChangePassword: false,
        });

        authenticate(req, res, next);

        expect(req.user).toEqual({
            id: 'user-1',
            email: 'admin@patyodklima.hu',
            role: 'admin',
            mustChangePassword: false,
        });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid tokens', () => {
        req.headers.authorization = 'Bearer invalid-token';
        authService.verifyToken.mockImplementation(() => {
            throw new Error('invalid token');
        });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Érvénytelen vagy lejárt token.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject unsupported roles', () => {
        req.headers.authorization = 'Bearer valid-token';
        authService.verifyToken.mockReturnValue({
            sub: 'user-1',
            email: 'guest@patyodklima.hu',
            role: 'guest',
        });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hozzáférés megtagadva.' });
        expect(next).not.toHaveBeenCalled();
    });
});
