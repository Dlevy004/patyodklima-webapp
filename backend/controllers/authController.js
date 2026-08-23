const authService = require('../services/authService');


const verifyTurnstile = async (token) => {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: token,
        }),
    });
    const data = await response.json();
    return data.success;
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe, turnstileToken } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail cím és jelszó megadása szükséges.' });
        }

        if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
            return res.status(400).json({ message: 'Bot ellenőrzés sikertelen.' });
        }

        const result = await authService.login({ email, password, rememberMe });

        if (!result.success) {
            return res.status(401).json({ message: 'Érvénytelen e-mail cím vagy jelszó.' });
        }

        return res.status(200).json({
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error while logging in:', error.message);
        return res.status(500).json({ message: 'Hiba történt a bejelentkezés során.' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'A felhasználó nem található.' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error while fetching current user:', error.message);
        return res.status(500).json({ message: 'Hiba történt a felhasználói adatok lekérése közben.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'A jelenlegi és az új jelszó megadása szükséges.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Az új jelszónak legalább 8 karakter hosszúnak kell lennie.' });
        }

        const result = await authService.changePassword({
            userId: req.user.id,
            currentPassword,
            newPassword,
        });

        if (!result.success) {
            if (result.error === 'INVALID_CURRENT_PASSWORD') {
                return res.status(401).json({ message: 'A jelenlegi jelszó helytelen.' });
            }
            if (result.error === 'SAME_PASSWORD') {
                return res.status(400).json({ message: 'Az új jelszónak el kell térnie a jelenlegi jelszótól.' });
            }
            return res.status(404).json({ message: 'A felhasználó nem található.' });
        }

        return res.status(200).json({
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error while changing password:', error.message);
        return res.status(500).json({ message: 'Hiba történt a jelszó módosítása közben.' });
    }
};

module.exports = {
    login,
    getMe,
    changePassword,
};