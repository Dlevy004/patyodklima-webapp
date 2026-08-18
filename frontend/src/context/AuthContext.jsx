import {
    createContext, useCallback, useContext,
    useEffect, useMemo, useState
} from 'react';

import { API_BASE_URL, authFetch } from '../utils/api';
import { clearToken, getToken, setToken } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    const persistSession = useCallback((token, nextUser, rememberMe = false) => {
        setToken(token, rememberMe);
        setUser(nextUser);
    }, []);

    const login = useCallback(async ({ email, password, rememberMe }) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid email or password.');
        }

        persistSession(data.token, data.user, rememberMe);
        return data.user;
    }, [persistSession]);

    const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
        const response = await authFetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to change password.');
        }

        persistSession(data.token, data.user, false);
        return data.user;
    }, [persistSession]);

    const refreshUser = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return null;
        }

        try {
            const response = await authFetch(`${API_BASE_URL}/auth/me`);

            if (!response.ok) {
                throw new Error('Session expired.');
            }

            const data = await response.json();
            setUser(data.user);
            return data.user;
        } catch {
            logout();
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        changePassword,
        refreshUser,
    }), [user, isLoading, login, logout, changePassword, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }

    return context;
}

export default AuthContext;
