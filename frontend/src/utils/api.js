import { getToken } from './authStorage';


export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export function getAuthHeaders(extraHeaders = {}) {
    const token = getToken();

    return {
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function authFetch(url, options = {}) {
    const headers = getAuthHeaders(options.headers || {});

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const error = new Error('Unauthorized');
        error.status = 401;
        throw error;
    }

    return response;
}