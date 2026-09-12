const sharp = require('sharp');
const prisma = require('../database/prisma');

const visualDesignService = require('../services/visualDesignService');
const supabaseService = require('../services/supabaseService');

jest.mock('../database/prisma', () => ({
    ai_visual_designs: {
        create: jest.fn(),
        update: jest.fn(),
    }
}));

jest.mock('../services/supabaseService', () => ({
    uploadImage: jest.fn(),
    deleteImageFromBucket: jest.fn()
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
        ).rejects.toThrow('Cloudflare AI hiba: 500 - Internal Server Error');

        expect(prisma.ai_visual_designs.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { status: 'failed' }
        });
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
});