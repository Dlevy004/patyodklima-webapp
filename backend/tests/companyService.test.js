const companyService = require('../services/companyService');
const prisma = require('../database/prisma');

jest.mock('../database/prisma', () => ({
    company: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
    },
}));


describe('companyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockDbCompany = {
        id: 'default-company-id',
        name: 'Pátyod Klíma',
        headquarters: 'Csenger',
        registration_number: '123',
        tax_number: '456',
        f_gas_number: '789',
        phone_number: '+3630',
        email: 'info@patyod.hu'
    };

    const expectedFrontendCompany = {
        id: 'default-company-id',
        name: 'Pátyod Klíma',
        headquarters: 'Csenger',
        registrationNumber: '123',
        taxNumber: '456',
        fGasNumber: '789',
        phoneNumber: '+3630',
        email: 'info@patyod.hu'
    };

    describe('getCompany', () => {
        it('should return null if no company exists in the database', async () => {
            prisma.company.findFirst.mockResolvedValue(null);

            const result = await companyService.getCompany();

            expect(result).toBeNull();
            expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
        });

        it('should return a sanitized company object if it exists', async () => {
            prisma.company.findFirst.mockResolvedValue(mockDbCompany);

            const result = await companyService.getCompany();

            expect(result).toEqual(expectedFrontendCompany);
            expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateCompany', () => {
        const updateData = {
            name: 'Pátyod Klíma',
            headquarters: 'Csenger',
            registrationNumber: '123',
            taxNumber: '456',
            fGasNumber: '789',
            phoneNumber: '+3630',
            email: 'info@patyod.hu'
        };

        it('should upsert the company data and return the updated company', async () => {
            prisma.company.upsert.mockResolvedValue(mockDbCompany);

            const result = await companyService.updateCompany(updateData);

            expect(prisma.company.upsert).toHaveBeenCalledTimes(1);
            expect(prisma.company.upsert).toHaveBeenCalledWith({
                where: { id: '00000000-0000-0000-0000-000000000001' },
                update: {
                    name: 'Pátyod Klíma',
                    headquarters: 'Csenger',
                    registration_number: '123',
                    tax_number: '456',
                    f_gas_number: '789',
                    phone_number: '+3630',
                    email: 'info@patyod.hu'
                },
                create: {
                    id: '00000000-0000-0000-0000-000000000001',
                    name: 'Pátyod Klíma',
                    headquarters: 'Csenger',
                    registration_number: '123',
                    tax_number: '456',
                    f_gas_number: '789',
                    phone_number: '+3630',
                    email: 'info@patyod.hu'
                }
            });

            expect(result).toEqual(mockDbCompany);
        });
    });
});