const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authService = require('../services/authService');

jest.mock('../database/prisma', () => ({
    users: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

const prisma = require('../database/prisma');

describe('authService.login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '15m';
        process.env.JWT_REMEMBER_EXPIRES_IN = '7d';
    });

    it('should return token and user for valid admin credentials', async () => {
        const mockUser = {
            id: 'user-1',
            email: 'admin@patyodklima.hu',
            full_name: 'Admin',
            password_hash: 'hashed-password',
            role: 'admin',
            must_change_password: true,
        };

        prisma.users.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('signed-token');

        const result = await authService.login({
            email: 'admin@patyodklima.hu',
            password: 'secret123',
            rememberMe: false,
        });

        expect(result.success).toBe(true);
        expect(result.token).toBe('signed-token');
        expect(result.user).toEqual({
            id: 'user-1',
            email: 'admin@patyodklima.hu',
            fullName: 'Admin',
            role: 'admin',
            mustChangePassword: true,
        });
        expect(jwt.sign).toHaveBeenCalledWith(
            expect.objectContaining({ sub: 'user-1', role: 'admin' }),
            'test-secret',
            { expiresIn: '15m' }
        );
    });

    it('should use longer expiry when rememberMe is true', async () => {
        const mockUser = {
            id: 'user-2',
            email: 'dev@patyodklima.hu',
            full_name: 'Developer',
            password_hash: 'hashed-password',
            role: 'developer',
            must_change_password: false,
        };

        prisma.users.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('remember-token');

        await authService.login({
            email: 'dev@patyodklima.hu',
            password: 'secret123',
            rememberMe: true,
        });

        expect(jwt.sign).toHaveBeenCalledWith(
            expect.any(Object),
            'test-secret',
            { expiresIn: '7d' }
        );
    });

    it('should reject invalid credentials', async () => {
        prisma.users.findUnique.mockResolvedValue(null);

        const result = await authService.login({
            email: 'unknown@patyodklima.hu',
            password: 'wrong',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('INVALID_CREDENTIALS');
    });

    it('should reject users with unsupported roles', async () => {
        prisma.users.findUnique.mockResolvedValue({
            id: 'user-3',
            email: 'guest@patyodklima.hu',
            password_hash: 'hashed-password',
            role: 'guest',
        });

        const result = await authService.login({
            email: 'guest@patyodklima.hu',
            password: 'secret123',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('INVALID_CREDENTIALS');
    });
});

describe('authService.changePassword', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should update password and clear must_change_password flag', async () => {
        const mockUser = {
            id: 'user-1',
            email: 'admin@patyodklima.hu',
            full_name: 'Admin',
            password_hash: 'old-hash',
            role: 'admin',
            must_change_password: true,
        };

        const updatedUser = {
            ...mockUser,
            password_hash: 'new-hash',
            must_change_password: false,
        };

        prisma.users.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue('new-hash');
        prisma.users.update.mockResolvedValue(updatedUser);
        jwt.sign.mockReturnValue('new-token');

        const result = await authService.changePassword({
            userId: 'user-1',
            currentPassword: 'old-password',
            newPassword: 'new-password',
        });

        expect(result.success).toBe(true);
        expect(result.token).toBe('new-token');
        expect(result.user.mustChangePassword).toBe(false);
        expect(prisma.users.update).toHaveBeenCalledWith({
            where: { id: 'user-1' },
            data: {
                password_hash: 'new-hash',
                must_change_password: false,
            },
        });
    });

    it('should reject incorrect current password', async () => {
        prisma.users.findUnique.mockResolvedValue({
            id: 'user-1',
            email: 'admin@patyodklima.hu',
            password_hash: 'old-hash',
            role: 'admin',
        });
        bcrypt.compare.mockResolvedValue(false);

        const result = await authService.changePassword({
            userId: 'user-1',
            currentPassword: 'wrong-password',
            newPassword: 'new-password',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('INVALID_CURRENT_PASSWORD');
    });
});

describe('authService.verifyToken', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should verify a valid token', () => {
        jwt.verify.mockReturnValue({ sub: 'user-1', role: 'admin' });

        const decoded = authService.verifyToken('valid-token');

        expect(decoded).toEqual({ sub: 'user-1', role: 'admin' });
        expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    });

    describe('authService.login - additional branches', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            process.env.JWT_SECRET = 'test-secret';
        });

        it('should reject when the password does not match', async () => {
            prisma.users.findUnique.mockResolvedValue({
                id: 'user-1',
                email: 'admin@patyodklima.hu',
                password_hash: 'hashed-password',
                role: 'admin',
            });
            bcrypt.compare.mockResolvedValue(false);

            const result = await authService.login({
                email: 'admin@patyodklima.hu',
                password: 'wrong-password',
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('INVALID_CREDENTIALS');
        });
    });

    describe('authService.getUserById', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return null if the user does not exist or has an unsupported role', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const result = await authService.getUserById('missing-id');

            expect(result).toBeNull();
        });

        it('should return the sanitized user if found', async () => {
            prisma.users.findUnique.mockResolvedValue({
                id: 'user-1',
                email: 'admin@patyodklima.hu',
                full_name: 'Admin',
                role: 'admin',
                must_change_password: false,
            });

            const result = await authService.getUserById('user-1');

            expect(result).toEqual({
                id: 'user-1',
                email: 'admin@patyodklima.hu',
                fullName: 'Admin',
                role: 'admin',
                mustChangePassword: false,
            });
        });
    });

    describe('authService.changePassword - additional branches', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            process.env.JWT_SECRET = 'test-secret';
        });

        it('should reject if the user does not exist', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const result = await authService.changePassword({
                userId: 'missing-id',
                currentPassword: 'old',
                newPassword: 'new',
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('USER_NOT_FOUND');
        });

        it('should reject if the new password matches the current password', async () => {
            prisma.users.findUnique.mockResolvedValue({
                id: 'user-1',
                password_hash: 'old-hash',
                role: 'admin',
            });
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.changePassword({
                userId: 'user-1',
                currentPassword: 'same-password',
                newPassword: 'same-password',
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('SAME_PASSWORD');
        });
    });

    describe('authService - missing JWT_SECRET', () => {
        it('should throw an error when JWT_SECRET is not set', () => {
            delete process.env.JWT_SECRET;

            expect(() => authService.verifyToken('any-token')).toThrow('JWT_SECRET is not configured.');
        });
    });
});