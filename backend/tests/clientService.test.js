const prisma = require('../database/prisma');
const clientService = require('../services/clientService');

jest.mock('../database/prisma', () => ({
    clients: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}));

describe('getAllClients', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all clients', async () => {
        // Arrange
        const mockClients = [
            { id: '1', full_name: 'Teszt Elek', phone: '06201234567' },
            { id: '2', full_name: 'Minta Máté', phone: '06207654321' },
        ];
        prisma.clients.findMany.mockResolvedValue(mockClients);

        // Act
        const result = await clientService.getAllClients();

        // Assert
        expect(result).toEqual(mockClients);
        expect(prisma.clients.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no clients exists', async () => {
        // Arrange
        const mockClients = [];
        prisma.clients.findMany.mockResolvedValue(mockClients);

        // Act
        const result = await clientService.getAllClients();

        // Assert
        expect(result).toEqual(mockClients);
        expect(prisma.clients.findMany).toHaveBeenCalledTimes(1);
    });
});

describe('getClientById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a client if it exists', async () => {
        // Arrange
        const mockClient = { id: '1', full_name: 'Minta Máté', mail: 'minta.mate@mail.com' };
        prisma.clients.findUnique.mockResolvedValue(mockClient);

        // Act
        const result = await clientService.getClientById('1');

        // Assert
        expect(result).toEqual(mockClient);
        expect(prisma.clients.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.clients.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if the client does not exist', async () => {
        // Arrange
        const mockClient = null;
        prisma.clients.findUnique.mockResolvedValue(mockClient);

        // Act
        const result = await clientService.getClientById('1');

        // Assert
        expect(result).toEqual(mockClient);
        expect(prisma.clients.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.clients.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });
});