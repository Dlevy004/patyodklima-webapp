const prisma = require('../database/prisma');
const referenceService = require('../services/referenceService');

jest.mock('../database/prisma', () => ({
    reference_image: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}));

describe('createReference', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new reference', async () => {
        // Arrange
        const newReference = {
            image_url: 'https://supabase.com/levy/reference-img-1.webp',
            description: 'Teszt telepítés Pátyodon',
            is_visible: true
        };
        const createdReference = { id: '1', ...newReference };
        prisma.reference_image.create.mockResolvedValue(createdReference);

        // Act
        const result = await referenceService.createReference(newReference);

        // Assert
        expect(result).toEqual(createdReference);
        expect(prisma.reference_image.create).toHaveBeenCalledTimes(1);
        expect(prisma.reference_image.create).toHaveBeenCalledWith({
            data: {
                image_url: newReference.image_url,
                description: newReference.description,
                is_visible: newReference.is_visible
            }
        });
    });
});

describe('getAllReferences', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all references ordered by created_at', async () => {
        // Arrange
        const mockReferences = [
            { id: '1', image_url: 'kep1.jpg', description: 'Első kép' },
            { id: '2', image_url: 'kep2.jpg', description: 'Második kép' },
        ];
        prisma.reference_image.findMany.mockResolvedValue(mockReferences);

        // Act
        const result = await referenceService.getAllReferences();

        // Assert
        expect(result).toEqual(mockReferences);
        expect(prisma.reference_image.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.reference_image.findMany).toHaveBeenCalledWith({
            orderBy: { created_at: 'desc' }
        });
    });
});

describe('getReferenceById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a reference if it exists', async () => {
        // Arrange
        const mockReference = { id: '1', image_url: 'kep.jpg' };
        prisma.reference_image.findUnique.mockResolvedValue(mockReference);

        // Act
        const result = await referenceService.getReferenceById('1');

        // Assert
        expect(result).toEqual(mockReference);
        expect(prisma.reference_image.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.reference_image.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });
});

describe('updateReference', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a reference if it exists', async () => {
        // Arrange
        const updatedData = {
            image_url: 'ujkep.jpg',
            description: 'Frissített leírás',
            is_visible: false
        };
        const mockReference = { id: '1', ...updatedData };
        prisma.reference_image.update.mockResolvedValue(mockReference);

        // Act
        const result = await referenceService.updateReference('1', updatedData);

        // Assert
        expect(result).toEqual(mockReference);
        expect(prisma.reference_image.update).toHaveBeenCalledTimes(1);
        expect(prisma.reference_image.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: updatedData
        });
    });
});

describe('deleteReference', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a reference if it exists', async () => {
        // Arrange
        const mockReference = { id: '1', image_url: 'kep.jpg' };
        prisma.reference_image.delete.mockResolvedValue(mockReference);

        // Act
        const result = await referenceService.deleteReference('1');

        // Assert
        expect(result).toEqual(mockReference);
        expect(prisma.reference_image.delete).toHaveBeenCalledTimes(1);
        expect(prisma.reference_image.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
});