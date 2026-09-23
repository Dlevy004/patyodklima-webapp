const request = require('supertest');

jest.mock('../routes/index', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/ping', (req, res) => res.json({ pong: true }));
    router.get('/boom', (req, res, next) => {
        next(new Error('Something broke'));
    });
    return router;
});

const app = require('../app');

describe('app.js (Express app)', () => {
    it('should respond 200 OK on the health check endpoint', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.text).toBe('OK');
    });

    it('should return 404 with a JSON message for an unknown route', async () => {
        const res = await request(app).get('/api/does-not-exist');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Not found' });
    });

    it('should set helmet security headers', async () => {
        const res = await request(app).get('/api/health');

        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    });

    it('should allow requests with no Origin header (e.g. server-to-server, curl)', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
    });

    it('should allow an explicitly whitelisted origin', async () => {
        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'http://localhost:5173');

        expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should not reflect a non-whitelisted origin in the CORS header', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'https://gonosz-oldal.com');

        expect(res.headers['access-control-allow-origin']).toBeUndefined();

        consoleSpy.mockRestore();
    });

    it('should route requests through /api to the routes module', async () => {
        const res = await request(app).get('/api/ping');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ pong: true });
    });

    it('should handle errors from routes via the global error handler', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const res = await request(app).get('/api/boom');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Something broke' });
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});