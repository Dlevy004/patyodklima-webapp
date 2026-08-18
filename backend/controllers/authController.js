const authService = require('../services/authService');


const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const result = await authService.login({ email, password, rememberMe });

        if (!result.success) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        return res.status(200).json({
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error while logging in:', error.message);
        return res.status(500).json({ message: 'An error occurred while logging in.' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error while fetching current user:', error.message);
        return res.status(500).json({ message: 'An error occurred while fetching user data.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'The new password must be at least 8 characters long.' });
        }

        const result = await authService.changePassword({
            userId: req.user.id,
            currentPassword,
            newPassword,
        });

        if (!result.success) {
            if (result.error === 'INVALID_CURRENT_PASSWORD') {
                return res.status(401).json({ message: 'The current password is incorrect.' });
            }
            if (result.error === 'SAME_PASSWORD') {
                return res.status(400).json({ message: 'The new password must be different from the current password.' });
            }
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error while changing password:', error.message);
        return res.status(500).json({ message: 'An error occurred while changing password.' });
    }
};

module.exports = {
    login,
    getMe,
    changePassword,
};