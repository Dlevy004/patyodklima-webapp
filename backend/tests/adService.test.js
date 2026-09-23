const prisma = require('../database/prisma');

const {
    getAllTemplates,
    getAllAdAcUnits,
    getAllAds,
    getAdById,
    createAd,
    deleteAd
} = require('../services/adService');

jest.mock('../database/prisma', () => ({
    ad_templates: {
        findMany: jest.fn()
    },
    ac_units: {
        findMany: jest.fn()
    },
    generated_ads: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn()
    }
}));

describe('adService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTemplates', () => {
        test('returns all templates ordered by category and name', async () => {
            const mockTemplates = [
                {
                    id: '1',
                    name: 'Template A',
                    category: 'Beltéri'
                },
                {
                    id: '2',
                    name: 'Template B',
                    category: 'Kültéri'
                }
            ];

            prisma.ad_templates.findMany.mockResolvedValue(mockTemplates);

            const result = await getAllTemplates();

            expect(result).toEqual(mockTemplates);

            expect(prisma.ad_templates.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.ad_templates.findMany).toHaveBeenCalledWith({
                orderBy: [
                    { category: 'asc' },
                    { name: 'asc' }
                ]
            });
        });
    });

    describe('getAllAdAcUnits', () => {
        test('returns all AC units ordered by brand and model name', async () => {
            const mockUnits = [
                {
                    id: '1',
                    brand: 'Daikin',
                    model_name: 'FTXF'
                },
                {
                    id: '2',
                    brand: 'Gree',
                    model_name: 'Amber'
                }
            ];

            prisma.ac_units.findMany.mockResolvedValue(mockUnits);

            const result = await getAllAdAcUnits();

            expect(result).toEqual(mockUnits);

            expect(prisma.ac_units.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.ac_units.findMany).toHaveBeenCalledWith({
                orderBy: [
                    { brand: 'asc' },
                    { model_name: 'asc' }
                ]
            });
        });
    });

    describe('getAllAds', () => {
        test('returns ads for the specified user with template information', async () => {
            const userId = 'user-123';

            const mockAds = [
                {
                    id: 'ad-1',
                    user_id: userId,
                    headline: 'Akció',
                    ad_templates: {
                        name: 'Modern',
                        category: 'Beltéri'
                    }
                }
            ];

            prisma.generated_ads.findMany.mockResolvedValue(mockAds);

            const result = await getAllAds(userId);

            expect(result).toEqual(mockAds);

            expect(prisma.generated_ads.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_ads.findMany).toHaveBeenCalledWith({
                where: {
                    user_id: userId
                },
                orderBy: {
                    created_at: 'desc'
                },
                include: {
                    ad_templates: {
                        select: {
                            name: true,
                            category: true
                        }
                    }
                }
            });
        });
    });

    describe('getAdById', () => {
        test('returns the ad matching both ad id and user id', async () => {
            const adId = 'ad-123';
            const userId = 'user-456';

            const mockAd = {
                id: adId,
                user_id: userId,
                headline: 'Teszt hirdetés'
            };

            prisma.generated_ads.findFirst.mockResolvedValue(mockAd);

            const result = await getAdById(adId, userId);

            expect(result).toEqual(mockAd);

            expect(prisma.generated_ads.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.generated_ads.findFirst).toHaveBeenCalledWith({
                where: {
                    id: adId,
                    user_id: userId
                }
            });
        });
    });

    describe('createAd', () => {
        test('creates an ad with all provided values', async () => {
            const userId = 'user-123';

            const data = {
                templateId: 'template-1',
                headline: 'Prémium klíma akció',
                acUnitName: 'Daikin Sensira',
                details: 'Ingyenes kiszállítás',
                fullPrice: '299990',
                showLogo: true,
                showPhone: false,
                generatedImageUrl: 'https://example.com/ad.png'
            };

            const mockCreatedAd = {
                id: 'ad-1',
                user_id: userId,
                template_id: 'template-1',
                headline: 'Prémium klíma akció',
                ac_unit_name: 'Daikin Sensira',
                details: 'Ingyenes kiszállítás',
                full_price: '299990',
                show_logo: true,
                show_phone: false,
                generated_image_url: 'https://example.com/ad.png'
            };

            prisma.generated_ads.create.mockResolvedValue(mockCreatedAd);

            const result = await createAd(userId, data);

            expect(result).toEqual(mockCreatedAd);

            expect(prisma.generated_ads.create).toHaveBeenCalledTimes(1);
            expect(prisma.generated_ads.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Prémium klíma akció',
                    ac_unit_name: 'Daikin Sensira',
                    details: 'Ingyenes kiszállítás',
                    full_price: '299990',
                    show_logo: true,
                    show_phone: false,
                    generated_image_url: 'https://example.com/ad.png'
                }
            });
        });

        test('uses null for empty optional string values', async () => {
            const userId = 'user-123';

            const data = {
                templateId: '',
                headline: '',
                acUnitName: 'Daikin Sensira',
                details: '',
                fullPrice: '299990',
                showLogo: true,
                showPhone: true,
                generatedImageUrl: 'https://example.com/ad.png'
            };

            prisma.generated_ads.create.mockResolvedValue({
                id: 'ad-2'
            });

            await createAd(userId, data);

            expect(prisma.generated_ads.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: null,
                    headline: null,
                    ac_unit_name: 'Daikin Sensira',
                    details: null,
                    full_price: '299990',
                    show_logo: true,
                    show_phone: true,
                    generated_image_url: 'https://example.com/ad.png'
                }
            });
        });

        test('uses default true for null boolean values', async () => {
            const userId = 'user-123';

            const data = {
                templateId: 'template-1',
                headline: 'Teszt',
                acUnitName: 'Gree Amber',
                details: 'Részletek',
                fullPrice: '199990',
                showLogo: null,
                showPhone: null,
                generatedImageUrl: 'https://example.com/ad.png'
            };

            prisma.generated_ads.create.mockResolvedValue({
                id: 'ad-3'
            });

            await createAd(userId, data);

            expect(prisma.generated_ads.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Teszt',
                    ac_unit_name: 'Gree Amber',
                    details: 'Részletek',
                    full_price: '199990',
                    show_logo: true,
                    show_phone: true,
                    generated_image_url: 'https://example.com/ad.png'
                }
            });
        });

        test('preserves false boolean values', async () => {
            const userId = 'user-123';

            const data = {
                templateId: 'template-1',
                headline: 'Teszt',
                acUnitName: 'Gree Amber',
                details: 'Részletek',
                fullPrice: '199990',
                showLogo: false,
                showPhone: false,
                generatedImageUrl: 'https://example.com/ad.png'
            };

            prisma.generated_ads.create.mockResolvedValue({
                id: 'ad-4'
            });

            await createAd(userId, data);

            expect(prisma.generated_ads.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Teszt',
                    ac_unit_name: 'Gree Amber',
                    details: 'Részletek',
                    full_price: '199990',
                    show_logo: false,
                    show_phone: false,
                    generated_image_url: 'https://example.com/ad.png'
                }
            });
        });
    });

    describe('deleteAd', () => {
        test('returns true when an ad was deleted', async () => {
            const adId = 'ad-123';
            const userId = 'user-456';

            prisma.generated_ads.deleteMany.mockResolvedValue({
                count: 1
            });

            const result = await deleteAd(adId, userId);

            expect(result).toBe(true);

            expect(prisma.generated_ads.deleteMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_ads.deleteMany).toHaveBeenCalledWith({
                where: {
                    id: adId,
                    user_id: userId
                }
            });
        });

        test('returns false when no ad was deleted', async () => {
            const adId = 'ad-123';
            const userId = 'user-456';

            prisma.generated_ads.deleteMany.mockResolvedValue({
                count: 0
            });

            const result = await deleteAd(adId, userId);

            expect(result).toBe(false);

            expect(prisma.generated_ads.deleteMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_ads.deleteMany).toHaveBeenCalledWith({
                where: {
                    id: adId,
                    user_id: userId
                }
            });
        });
    });
});