import { afterEach, describe, expect, it, vi } from 'vitest';

import { authFetch, getAuthHeaders } from './api';
import { getToken } from './authStorage';


vi.mock('./authStorage', () => ({
    getToken: vi.fn(),
}));

window.fetch = vi.fn();

describe('API Utils', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAuthHeaders', () => {
        it('should attach Bearer token if token exists', () => {
            vi.mocked(getToken).mockReturnValue('fake-token');
            const headers = getAuthHeaders({ 'Content-Type': 'application/json' });

            expect(headers).toEqual({
                'Content-Type': 'application/json',
                Authorization: 'Bearer fake-token',
            });
        });

        it('should return empty/extra headers if no token exists', () => {
            vi.mocked(getToken).mockReturnValue(null);
            expect(getAuthHeaders()).toEqual({});
        });
    });

    describe('authFetch', () => {
        it('should return the response if status is not 401', async () => {
            const mockResponse = { status: 200, ok: true };
            window.fetch.mockResolvedValueOnce(mockResponse);

            const response = await authFetch('/test-endpoint');

            expect(window.fetch).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
        });

        it('should throw an Unauthorized error if status is 401', async () => {
            const mockResponse = { status: 401 };
            window.fetch.mockResolvedValueOnce(mockResponse);

            try {
                await authFetch('/test-endpoint');

                expect(true).toBe(false);
            } catch (error) {
                expect(error.message).toBe('Unauthorized');
                expect(error.status).toBe(401);
            }
        });
    });
});