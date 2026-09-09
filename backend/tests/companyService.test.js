const companyService = require('../services/companyService');
const prisma = require('../database/prisma');

jest.mock('../database/prisma', () => ({
    company: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    },
}));


describe('companyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockDbCompany = {
        id: 'company-123',
        name: 'Pátyod Klíma',
        headquarters: 'Csenger',
        registration_number: '123',
        tax_number: '456',
        f_gas_number: '789',
        phone_number: '+3630',
        email: 'info@patyod.hu'
    };

    const expectedFrontendCompany = {
        id: 'company-123',
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

        it('should update the existing company if one is found', async () => {
            prisma.company.findFirst.mockResolvedValue(mockDbCompany);
            prisma.company.update.mockResolvedValue(mockDbCompany);

            const result = await companyService.updateCompany(updateData);

            expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.company.update).toHaveBeenCalledWith({
                where: { id: 'company-123' },
                data: {
                    name: 'Pátyod Klíma',
                    headquarters: 'Csenger',
                    registration_number: '123',
                    tax_number: '456',
                    f_gas_number: '789',
                    phone_number: '+3630',
                    email: 'info@patyod.hu'
                }
            });
            expect(prisma.company.create).not.toHaveBeenCalled();
            expect(result).toEqual(expectedFrontendCompany);
        });

        it('should create a new company if none exists in the database', async () => {
            prisma.company.findFirst.mockResolvedValue(null);
            prisma.company.create.mockResolvedValue(mockDbCompany);

            const result = await companyService.updateCompany(updateData);

            expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.company.create).toHaveBeenCalledWith({
                data: {
                    name: 'Pátyod Klíma',
                    headquarters: 'Csenger',
                    registration_number: '123',
                    tax_number: '456',
                    f_gas_number: '789',
                    phone_number: '+3630',
                    email: 'info@patyod.hu'
                }
            });
            expect(prisma.company.update).not.toHaveBeenCalled();
            expect(result).toEqual(expectedFrontendCompany);
        });
    });
});