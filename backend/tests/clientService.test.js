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
    it('should return all clients', async () => {
        const mockClients = [
            { id: '1', full_name: 'Teszt Elek', phone: '06201234567' },
            { id: '2', full_name: 'Minta Máté', phone: '06207654321' },
        ];
        prisma.clients.findMany.mockResolvedValue(mockClients);

        const result = await clientService.getAllClients();

        expect(result).toEqual(mockClients);
        expect(prisma.clients.findMany).toHaveBeenCalledTimes(1);
    })
})