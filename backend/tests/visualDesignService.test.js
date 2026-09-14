const sharp = require('sharp');
const prisma = require('../database/prisma');

const visualDesignService = require('../services/visualDesignService');
const supabaseService = require('../services/supabaseService');

jest.mock('../database/prisma', () => ({
    ai_visual_designs: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn()
    }
}));

jest.mock('../services/supabaseService', () => ({
    uploadImage: jest.fn(),
    deleteImage: jest.fn()
}));

jest.mock('sharp', () => {
    const sharpMock = {
        metadata: jest.fn().mockResolvedValue({ width: 1000, height: 1000 }),
        trim: jest.fn().mockReturnThis(),
        extract: jest.fn().mockReturnThis(),
        resize: jest.fn().mockReturnThis(),
        threshold: jest.fn().mockReturnThis(),
        png: jest.fn().mockReturnThis(),
        composite: jest.fn().mockReturnThis(),
        extractChannel: jest.fn().mockReturnThis(),
        joinChannel: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockImplementation(async (opts) => {
            if (opts && opts.resolveWithObject) {
                return {
                    data: Buffer.from('mocked-mask-data'),
                    info: { width: 100, height: 50, trimOffsetLeft: 200, trimOffsetTop: 300 }
                };
            }
            return Buffer.from('mocked-image-data');
        })
    };
    return jest.fn(() => sharpMock);
});

global.fetch = jest.fn();

describe('Visual Design', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('createPendingDesign should create a record with pending status', async () => {
        const mockDesign = { id: '123', status: 'pending' };
        prisma.ai_visual_designs.create.mockResolvedValue(mockDesign);

        const result = await visualDesignService.createPendingDesign('user-1', 'indoor');

        expect(prisma.ai_visual_designs.create).toHaveBeenCalledWith({
            data: {
                user_id: 'user-1',
                original_image_url: 'uploading...',
                placement_type: 'indoor',
                status: 'pending'
            }
        });
        expect(result).toEqual(mockDesign);
    });

    test('processAndSaveDesign should throw error if dimensions do not match', async () => {
        const sharpMock = require('sharp')();
        sharpMock.metadata
            .mockResolvedValueOnce({ width: 1000, height: 1000 })
            .mockResolvedValueOnce({ width: 800, height: 800 });

        const dummyBuffer = Buffer.from('dummy');
        await expect(
            visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {})
        ).rejects.toThrow('The dimensions of the original image and the mask do not match.');
    });

    test('processAndSaveDesign should process image, call AI, upload, and update DB to completed', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            arrayBuffer: async () => new ArrayBuffer(8)
        });

        supabaseService.uploadImage
            .mockResolvedValueOnce('https://supabase.../original.jpg')
            .mockResolvedValueOnce('https://supabase.../generated.png');

        const mockUpdatedDesign = { id: '123', status: 'completed' };
        prisma.ai_visual_designs.update.mockResolvedValue(mockUpdatedDesign);

        const dummyBuffer = Buffer.from('dummy');
        const result = await visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {});

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(supabaseService.uploadImage).toHaveBeenCalledTimes(2);

        expect(prisma.ai_visual_designs.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: {
                original_image_url: 'https://supabase.../original.jpg',
                generated_image_url: 'https://supabase.../generated.png',
                status: 'completed'
            }
        });
        expect(result).toEqual(mockUpdatedDesign);
    });

    test('processAndSaveDesign should update DB to failed if Cloudflare API fails', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        });

        const dummyBuffer = Buffer.from('dummy');

        await expect(
            visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {})
        ).rejects.toThrow(/Cloudflare AI/);

        expect(prisma.ai_visual_designs.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { status: 'failed' }
        });
    });

    test('processAndSaveDesign should delete uploaded images from Supabase if DB update fails', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            arrayBuffer: async () => new ArrayBuffer(8)
        });

        supabaseService.uploadImage
            .mockResolvedValueOnce('https://supabase.../original.jpg')
            .mockResolvedValueOnce('https://supabase.../generated.png');

        supabaseService.deleteImage.mockResolvedValue();

        prisma.ai_visual_designs.update
            .mockRejectedValueOnce(new Error('Prisma Database Error'))
            .mockResolvedValueOnce({ id: '123', status: 'failed' });

        const dummyBuffer = Buffer.from('dummy');

        await expect(
            visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {})
        ).rejects.toThrow('Prisma Database Error');

        expect(supabaseService.deleteImage).toHaveBeenCalledWith('https://supabase.../original.jpg', 'VisualDesign');
        expect(supabaseService.deleteImage).toHaveBeenCalledWith('https://supabase.../generated.png', 'VisualDesign');
    });

    test('processAndSaveDesign should adjust crop boundaries if mask is near the top-left edge (< 0)', async () => {
        const sharpMock = require('sharp')();
        sharpMock.toBuffer.mockImplementation(async (opts) => {
            if (opts && opts.resolveWithObject) {
                return {
                    data: Buffer.from('mocked-mask-data'),
                    info: { width: 100, height: 100, trimOffsetLeft: 0, trimOffsetTop: 0 }
                };
            }
            return Buffer.from('mocked-image-data');
        });

        global.fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
        prisma.ai_visual_designs.update.mockResolvedValue({ id: '124', status: 'completed' });

        const dummyBuffer = Buffer.from('dummy');
        await visualDesignService.processAndSaveDesign('124', dummyBuffer, dummyBuffer, 'test prompt', {});

        expect(sharpMock.extract).toHaveBeenCalledWith({ left: 0, top: 0, width: 150, height: 150 });
    });

    test('processAndSaveDesign should adjust crop boundaries if mask is near the bottom-right edge (> width/height)', async () => {
        const sharpMock = require('sharp')();
        sharpMock.toBuffer.mockImplementation(async (opts) => {
            if (opts && opts.resolveWithObject) {
                return {
                    data: Buffer.from('mocked-mask-data'),
                    info: { width: 100, height: 100, trimOffsetLeft: -900, trimOffsetTop: -900 }
                };
            }
            return Buffer.from('mocked-image-data');
        });

        global.fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
        prisma.ai_visual_designs.update.mockResolvedValue({ id: '125', status: 'completed' });

        const dummyBuffer = Buffer.from('dummy');
        await visualDesignService.processAndSaveDesign('125', dummyBuffer, dummyBuffer, 'test prompt', {});

        expect(sharpMock.extract).toHaveBeenCalledWith({ left: 850, top: 850, width: 150, height: 150 });
    });

    test('processAndSaveDesign should handle empty masks (undefined trimOffsetLeft)', async () => {
        const sharpMock = require('sharp')();
        sharpMock.toBuffer.mockImplementation(async (opts) => {
            if (opts && opts.resolveWithObject) {
                return {
                    data: Buffer.from('mocked-mask-data'),
                    info: { width: 1000, height: 1000 }
                };
            }
            return Buffer.from('mocked-image-data');
        });

        global.fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
        prisma.ai_visual_designs.update.mockResolvedValue({ id: '126', status: 'completed' });

        const dummyBuffer = Buffer.from('dummy');
        await visualDesignService.processAndSaveDesign('126', dummyBuffer, dummyBuffer, 'test prompt', {});

        expect(sharpMock.extract).toHaveBeenCalledWith({ left: 0, top: 0, width: 1000, height: 1000 });
    });

    test('processAndSaveDesign should execute timeout callback (abort controller)', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementationOnce((cb) => {
            cb();
            return 999;
        });

        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const dummyBuffer = Buffer.from('dummy');
        await expect(
            visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {})
        ).rejects.toThrow('Network Error');

        global.setTimeout.mockRestore();
    });

    test('processAndSaveDesign should catch errors if Supabase cleanup fails', async () => {
        global.fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
        supabaseService.uploadImage
            .mockResolvedValueOnce('https://supabase.../original.jpg')
            .mockResolvedValueOnce('https://supabase.../generated.png');

        supabaseService.deleteImage
            .mockRejectedValueOnce(new Error('Supabase Delete Error'))
            .mockRejectedValueOnce(new Error('Supabase Delete Error'));

        prisma.ai_visual_designs.update
            .mockRejectedValueOnce(new Error('Prisma Database Error'))
            .mockResolvedValueOnce({ id: '123', status: 'failed' });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const dummyBuffer = Buffer.from('dummy');
        await expect(
            visualDesignService.processAndSaveDesign('123', dummyBuffer, dummyBuffer, 'test prompt', {})
        ).rejects.toThrow('Prisma Database Error');

        expect(consoleSpy).toHaveBeenCalledTimes(2);

        consoleSpy.mockRestore();
    });

    test('getAllDesigns should return all designs for the given user ordered by newest first', async () => {
        const mockDesigns = [
            { id: '2', user_id: 'user-1', created_at: '2026-09-14T12:00:00Z' },
            { id: '1', user_id: 'user-1', created_at: '2026-09-13T12:00:00Z' }
        ];

        prisma.ai_visual_designs.findMany.mockResolvedValue(mockDesigns);

        const result = await visualDesignService.getAllDesigns('user-1');

        expect(prisma.ai_visual_designs.findMany).toHaveBeenCalledWith({
            where: { user_id: 'user-1' },
            orderBy: { created_at: 'desc' }
        });

        expect(result).toEqual(mockDesigns);
    });

    test('deleteDesign should delete the design belonging to the given user and return true', async () => {
        prisma.ai_visual_designs.deleteMany.mockResolvedValue({ count: 1 });

        const result = await visualDesignService.deleteDesign('123', 'user-1');

        expect(prisma.ai_visual_designs.deleteMany).toHaveBeenCalledWith({
            where: { id: '123', user_id: 'user-1' }
        });
        expect(result).toBe(true);
    });

    test('deleteDesign should return false if no design was deleted (not found or not owned)', async () => {
        prisma.ai_visual_designs.deleteMany.mockResolvedValue({ count: 0 });

        const result = await visualDesignService.deleteDesign('123', 'user-1');

        expect(result).toBe(false);
    });

    test('getDesignById should return the design belonging to the given user', async () => {
        const mockDesign = {
            id: '123',
            user_id: 'user-1',
            status: 'completed'
        };

        prisma.ai_visual_designs.findFirst.mockResolvedValue(mockDesign);

        const result = await visualDesignService.getDesignById('123', 'user-1');

        expect(prisma.ai_visual_designs.findFirst).toHaveBeenCalledWith({
            where: { id: '123', user_id: 'user-1' }
        });
        expect(result).toEqual(mockDesign);
    });

    test('getDesignById should return null if the design belongs to another user', async () => {
        prisma.ai_visual_designs.findFirst.mockResolvedValue(null);

        const result = await visualDesignService.getDesignById('123', 'other-user');

        expect(result).toBeNull();
    });
});