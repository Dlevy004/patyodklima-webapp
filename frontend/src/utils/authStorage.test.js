import { describe, expect, it, beforeEach } from 'vitest';

import { clearToken, getToken, isRememberMeEnabled, setToken } from './authStorage';


describe('authStorage', () => {
    beforeEach(() => {
        clearToken();
    });

    it('should store token in sessionStorage by default', () => {
        setToken('session-token', false);

        expect(getToken()).toBe('session-token');
        expect(sessionStorage.getItem('patyodklima_auth_token')).toBe('session-token');
        expect(isRememberMeEnabled()).toBe(false);
    });

    it('should store token in localStorage when remember me is enabled', () => {
        setToken('remember-token', true);

        expect(getToken()).toBe('remember-token');
        expect(localStorage.getItem('patyodklima_auth_token')).toBe('remember-token');
        expect(isRememberMeEnabled()).toBe(true);
    });

    it('should clear token from both storages', () => {
        setToken('remember-token', true);
        clearToken();

        expect(getToken()).toBeNull();
        expect(localStorage.getItem('patyodklima_auth_token')).toBeNull();
        expect(sessionStorage.getItem('patyodklima_auth_token')).toBeNull();
    });
});
