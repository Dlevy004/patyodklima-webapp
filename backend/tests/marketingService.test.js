const prisma = require('../database/prisma');

const {
    getAllTemplates,
    getAllMarketingAcUnits,
    getAllMarketing,
    getMarketingById,
    createMarketing,
    deleteMarketing
} = require('../services/marketingService');

jest.mock('../database/prisma', () => ({
    marketing_templates: {
        findMany: jest.fn()
    },
    ac_units: {
        findMany: jest.fn()
    },
    generated_marketings: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn()
    }
}));

describe('marketingService', () => {
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

            prisma.marketing_templates.findMany.mockResolvedValue(mockTemplates);

            const result = await getAllTemplates();

            expect(result).toEqual(mockTemplates);

            expect(prisma.marketing_templates.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.marketing_templates.findMany).toHaveBeenCalledWith({
                orderBy: [
                    { category: 'asc' },
                    { name: 'asc' }
                ]
            });
        });
    });

    describe('getAllMarketingAcUnits', () => {
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

            const result = await getAllMarketingAcUnits();

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

    describe('getAllMarketings', () => {
        test('returns marketings for the specified user with template information', async () => {
            const userId = 'user-123';

            const mockMarketings = [
                {
                    id: 'marketing-1',
                    user_id: userId,
                    headline: 'Akció',
                    marketing_templates: {
                        name: 'Modern',
                        category: 'Beltéri'
                    }
                }
            ];

            prisma.generated_marketings.findMany.mockResolvedValue(mockMarketings);

            const result = await getAllMarketings(userId);

            expect(result).toEqual(mockMarketings);

            expect(prisma.generated_marketings.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_marketings.findMany).toHaveBeenCalledWith({
                where: {
                    user_id: userId
                },
                orderBy: {
                    created_at: 'desc'
                },
                include: {
                    marketing_templates: {
                        select: {
                            name: true,
                            category: true
                        }
                    }
                }
            });
        });
    });

    describe('getMarketingById', () => {
        test('returns the marketing matching both marketing id and user id', async () => {
            const marketingId = 'marketing-123';
            const userId = 'user-456';

            const mockMarketing = {
                id: marketingId,
                user_id: userId,
                headline: 'Teszt hirdetés'
            };

            prisma.generated_marketings.findFirst.mockResolvedValue(mockMarketing);

            const result = await getMarketingById(marketingId, userId);

            expect(result).toEqual(mockMarketing);

            expect(prisma.generated_marketings.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.generated_marketings.findFirst).toHaveBeenCalledWith({
                where: {
                    id: marketingId,
                    user_id: userId
                }
            });
        });
    });

    describe('createMarketing', () => {
        test('creates an marketing with all provided values', async () => {
            const userId = 'user-123';

            const data = {
                templateId: 'template-1',
                headline: 'Prémium klíma akció',
                acUnitName: 'Daikin Sensira',
                details: 'Ingyenes kiszállítás',
                fullPrice: '299990',
                showLogo: true,
                showPhone: false,
                generatedImageUrl: 'https://example.com/marketing.png'
            };

            const mockCreatedMarketing = {
                id: 'marketing-1',
                user_id: userId,
                template_id: 'template-1',
                headline: 'Prémium klíma akció',
                ac_unit_name: 'Daikin Sensira',
                details: 'Ingyenes kiszállítás',
                full_price: '299990',
                show_logo: true,
                show_phone: false,
                generated_image_url: 'https://example.com/marketing.png'
            };

            prisma.generated_marketings.create.mockResolvedValue(mockCreatedMarketing);

            const result = await createMarketing(userId, data);

            expect(result).toEqual(mockCreatedMarketing);

            expect(prisma.generated_marketings.create).toHaveBeenCalledTimes(1);
            expect(prisma.generated_marketings.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Prémium klíma akció',
                    ac_unit_name: 'Daikin Sensira',
                    details: 'Ingyenes kiszállítás',
                    full_price: '299990',
                    show_logo: true,
                    show_phone: false,
                    generated_image_url: 'https://example.com/marketing.png'
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
                generatedImageUrl: 'https://example.com/marketing.png'
            };

            prisma.generated_marketings.create.mockResolvedValue({
                id: 'marketing-2'
            });

            await createMarketing(userId, data);

            expect(prisma.generated_marketings.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: null,
                    headline: null,
                    ac_unit_name: 'Daikin Sensira',
                    details: null,
                    full_price: '299990',
                    show_logo: true,
                    show_phone: true,
                    generated_image_url: 'https://example.com/marketing.png'
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
                generatedImageUrl: 'https://example.com/marketing.png'
            };

            prisma.generated_marketings.create.mockResolvedValue({
                id: 'marketing-3'
            });

            await createMarketing(userId, data);

            expect(prisma.generated_marketings.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Teszt',
                    ac_unit_name: 'Gree Amber',
                    details: 'Részletek',
                    full_price: '199990',
                    show_logo: true,
                    show_phone: true,
                    generated_image_url: 'https://example.com/marketing.png'
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
                generatedImageUrl: 'https://example.com/marketing.png'
            };

            prisma.generated_marketings.create.mockResolvedValue({
                id: 'marketing-4'
            });

            await createMarketing(userId, data);

            expect(prisma.generated_marketings.create).toHaveBeenCalledWith({
                data: {
                    user_id: userId,
                    template_id: 'template-1',
                    headline: 'Teszt',
                    ac_unit_name: 'Gree Amber',
                    details: 'Részletek',
                    full_price: '199990',
                    show_logo: false,
                    show_phone: false,
                    generated_image_url: 'https://example.com/marketing.png'
                }
            });
        });
    });

    describe('deleteMarketing', () => {
        test('returns true when an marketing was deleted', async () => {
            const marketingId = 'marketing-123';
            const userId = 'user-456';

            prisma.generated_marketings.deleteMany.mockResolvedValue({
                count: 1
            });

            const result = await deleteMarketing(marketingId, userId);

            expect(result).toBe(true);

            expect(prisma.generated_marketings.deleteMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_marketings.deleteMany).toHaveBeenCalledWith({
                where: {
                    id: marketingId,
                    user_id: userId
                }
            });
        });

        test('returns false when no marketing was deleted', async () => {
            const marketingId = 'marketing-123';
            const userId = 'user-456';

            prisma.generated_marketings.deleteMany.mockResolvedValue({
                count: 0
            });

            const result = await deleteMarketing(marketingId, userId);

            expect(result).toBe(false);

            expect(prisma.generated_marketings.deleteMany).toHaveBeenCalledTimes(1);
            expect(prisma.generated_marketings.deleteMany).toHaveBeenCalledWith({
                where: {
                    id: marketingId,
                    user_id: userId
                }
            });
        });
    });
});