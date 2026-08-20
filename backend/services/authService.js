const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../database/prisma');

const ALLOWED_ROLES = new Set(['admin', 'developer']);
const SALT_ROUNDS = 12;

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured.');
    }
    return secret;
};

const getTokenExpiry = (rememberMe) => {
    if (rememberMe) {
        return process.env.JWT_REMEMBER_EXPIRES_IN;
    }
    return process.env.JWT_EXPIRES_IN;
};

const sanitizeUser = (user) => ({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    mustChangePassword: user.must_change_password,
});

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);

const signToken = (user, rememberMe) => {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.must_change_password,
    };

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: getTokenExpiry(rememberMe),
    });
};

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

const login = async ({ email, password, rememberMe = false }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.users.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user || !ALLOWED_ROLES.has(user.role)) {
        return { success: false, error: 'INVALID_CREDENTIALS' };
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
        return { success: false, error: 'INVALID_CREDENTIALS' };
    }

    const token = signToken(user, rememberMe);

    return {
        success: true,
        token,
        user: sanitizeUser(user),
    };
};

const getUserById = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!user || !ALLOWED_ROLES.has(user.role)) {
        return null;
    }

    return sanitizeUser(user);
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!user || !ALLOWED_ROLES.has(user.role)) {
        return { success: false, error: 'USER_NOT_FOUND' };
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
        return { success: false, error: 'INVALID_CURRENT_PASSWORD' };
    }

    if (currentPassword === newPassword) {
        return { success: false, error: 'SAME_PASSWORD' };
    }

    const passwordHash = await hashPassword(newPassword);

    const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: {
            password_hash: passwordHash,
            must_change_password: false,
        },
    });

    const token = signToken(updatedUser, false);

    return {
        success: true,
        token,
        user: sanitizeUser(updatedUser),
    };
};

module.exports = {
    ALLOWED_ROLES,
    hashPassword,
    comparePassword,
    signToken,
    verifyToken,
    login,
    getUserById,
    changePassword,
    sanitizeUser,
};