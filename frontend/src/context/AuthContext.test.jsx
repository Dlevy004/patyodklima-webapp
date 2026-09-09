import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AuthProvider, useAuth } from './AuthContext';
import { authFetch, API_BASE_URL } from '../utils/api';
import { clearToken, getToken, setToken } from '../utils/authStorage';

vi.mock('../utils/api', () => ({
    API_BASE_URL: 'http://localhost:3000/api',
    authFetch: vi.fn(),
}));

vi.mock('../utils/authStorage', () => ({
    clearToken: vi.fn(),
    getToken: vi.fn(),
    setToken: vi.fn(),
}));

window.fetch = vi.fn();


describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useAuth hook', () => {
        it('should throw an error if used outside of AuthProvider', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider.');

            consoleSpy.mockRestore();
        });
    });

    describe('AuthProvider', () => {
        it('should set user to null and isLoading to false if no token exists on mount', async () => {
            getToken.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            expect(result.current.isLoading).toBe(false);

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it('should fetch user data successfully if token exists on mount', async () => {
            getToken.mockReturnValue('valid-token');
            const mockUser = { id: 'user-1', fullName: 'Daróczi Levente' };

            authFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: mockUser }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(authFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/me`);
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should clear user and logout if token exists but fetch fails (session expired)', async () => {
            getToken.mockReturnValue('expired-token');

            authFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Session expired' }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(clearToken).toHaveBeenCalledTimes(1);
            expect(result.current.user).toBeNull();
        });

        it('should login successfully, set session and return user', async () => {
            getToken.mockReturnValue(null);
            const mockUser = { id: 'user-1', email: 'test@patyodklima.hu' };

            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: 'new-token', user: mockUser }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.isLoading).toBe(false));

            let returnedUser;
            await act(async () => {
                returnedUser = await result.current.login({
                    email: 'test@patyodklima.hu',
                    password: 'pw',
                    rememberMe: true,
                    turnstileToken: 'token'
                });
            });

            expect(window.fetch).toHaveBeenCalledTimes(1);
            expect(setToken).toHaveBeenCalledWith('new-token', true);
            expect(result.current.user).toEqual(mockUser);
            expect(returnedUser).toEqual(mockUser);
        });

        it('should throw an error if login fails', async () => {
            getToken.mockReturnValue(null);

            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Invalid credentials.' }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.isLoading).toBe(false));

            await expect(
                result.current.login({ email: 'test@patyodklima.hu', password: 'wrong' })
            ).rejects.toThrow('Invalid credentials.');
        });

        it('should change password successfully and update session', async () => {
            getToken.mockReturnValue(null);
            const mockUser = { id: 'user-1', mustChangePassword: false };

            authFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: 'fresh-token', user: mockUser }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.isLoading).toBe(false));

            let returnedUser;
            await act(async () => {
                returnedUser = await result.current.changePassword({
                    currentPassword: 'old',
                    newPassword: 'new'
                });
            });

            expect(authFetch).toHaveBeenCalledTimes(1);
            expect(setToken).toHaveBeenCalledWith('fresh-token', false);
            expect(result.current.user).toEqual(mockUser);
            expect(returnedUser).toEqual(mockUser);
        });

        it('should throw an error if change password fails', async () => {
            getToken.mockReturnValue(null);

            authFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.isLoading).toBe(false));

            await expect(
                result.current.changePassword({ currentPassword: 'old', newPassword: 'new' })
            ).rejects.toThrow('Failed to change password.');
        });

        it('should clear token and set user to null on logout', async () => {

            getToken.mockReturnValue('valid-token');
            authFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: { id: 'user-1' } }),
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
            await waitFor(() => expect(result.current.user).not.toBeNull());

            act(() => {
                result.current.logout();
            });

            expect(clearToken).toHaveBeenCalledTimes(1);
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    it('should throw a default error if login fails and no message is provided from backend', async () => {
        getToken.mockReturnValue(null);

        window.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        await expect(
            result.current.login({ email: 'test@patyodklima.hu', password: 'wrong' })
        ).rejects.toThrow('Invalid email or password.');
    });
});