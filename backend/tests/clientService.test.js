const prisma = require('../database/prisma');
const clientService = require('../services/clientService');


jest.mock('../database/prisma', () => ({
    clients: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    },
    ac_units: { deleteMany: jest.fn() },
    reference_image: { deleteMany: jest.fn() },
    jobs: { deleteMany: jest.fn() }
}));

describe('createClient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new client', async () => {
        // Arrange
        const newClient = {
            full_name: 'Teszt Elek',
            phone: '06201234567',
            email: 'teszt.elek@mail.com',
            zip_code: '1234',
            city: 'Budapest',
            street_address: 'Fő utca 1.',
            type: 'individual',
            notes: 'Teszt ügyfél'
        };
        const createdClient = { id: '1', ...newClient };
        prisma.clients.create.mockResolvedValue(createdClient);

        // Act
        const result = await clientService.createClient(newClient);

        // Assert
        expect(result).toEqual(createdClient);
        expect(prisma.clients.create).toHaveBeenCalledTimes(1);
        expect(prisma.clients.create).toHaveBeenCalledWith({
            data: {
                full_name: newClient.full_name,
                phone: newClient.phone,
                email: newClient.email,
                zip_code: newClient.zip_code,
                city: newClient.city,
                street_address: newClient.street_address,
                type: newClient.type,
                notes: newClient.notes
            }
        });
    });

    it('should create a new client with default type', async () => {
        // Arrange
        const newClient = {
            full_name: 'Teszt Elek',
            phone: '06201234567',
            email: 'teszt.elek@mail.com',
            zip_code: '1234',
            city: 'Budapest',
            street_address: 'Fő utca 1.',
            notes: 'Teszt ügyfél'
        };
        const createdClient = { id: '1', ...newClient, type: 'individual' };
        prisma.clients.create.mockResolvedValue(createdClient);

        // Act
        const result = await clientService.createClient(newClient);

        // Assert
        expect(result).toEqual(createdClient);
        expect(prisma.clients.create).toHaveBeenCalledTimes(1);
        expect(prisma.clients.create).toHaveBeenCalledWith({
            data: {
                full_name: newClient.full_name,
                phone: newClient.phone,
                email: newClient.email,
                zip_code: newClient.zip_code,
                city: newClient.city,
                street_address: newClient.street_address,
                type: "individual",
                notes: newClient.notes
            }
        });
    });
});

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

describe('updateClient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a client if it exists', async () => {
        // Arrange
        const updatedClient = {
            full_name: 'Minta Máté',
            phone: '06207654321',
            email: 'minta.mate@mail.com',
            zip_code: '5678',
            city: 'Debrecen',
            street_address: 'Kossuth utca 2.',
            type: 'individual',
            notes: 'Frissített ügyfél'
        };
        const mockClient = { id: '1', ...updatedClient };
        prisma.clients.update.mockResolvedValue(mockClient);

        // Act
        const result = await clientService.updateClient('1', updatedClient);

        // Assert
        expect(result).toEqual(mockClient);
        expect(prisma.clients.update).toHaveBeenCalledTimes(1);
        expect(prisma.clients.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: updatedClient
        });
    });

    it('should throw an error if the client does not exist', async () => {
        // Arrange
        const updatedClient = {
            full_name: 'Minta Máté',
            phone: '06207654321',
            email: 'minta.mate@mail.com',
            zip_code: '5678',
            city: 'Debrecen',
            street_address: 'Kossuth utca 2.',
            type: 'individual',
            notes: 'Frissített ügyfél'
        };
        const mockClient = null;
        prisma.clients.update.mockResolvedValue(mockClient);

        // Act
        const result = await clientService.updateClient('1', updatedClient);

        // Assert
        expect(result).toEqual(mockClient);
        expect(prisma.clients.update).toHaveBeenCalledTimes(1);
        expect(prisma.clients.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: updatedClient
        });
    });
});

describe('deleteClient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if the client does not exist', async () => {
        // Arrange
        prisma.clients.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(clientService.deleteClient('1')).rejects.toThrow('Ügyfél nem található');
        expect(prisma.clients.findUnique).toHaveBeenCalledWith({
            where: { id: '1' },
            include: { jobs: true }
        });
    });

    it('should throw an error if the client has pending jobs', async () => {
        // Arrange
        const mockClient = {
            id: '1',
            jobs: [
                { id: 'job1', is_completed: true },
                { id: 'job2', is_completed: false }
            ]
        };
        prisma.clients.findUnique.mockResolvedValue(mockClient);

        // Act & Assert
        await expect(clientService.deleteClient('1')).rejects.toThrow('Nem törölhető: folyamatban lévő munka tartozik hozzá.');

        expect(prisma.clients.delete).not.toHaveBeenCalled();
    });

    it('should delete a client and no related records if they have no jobs', async () => {
        // Arrange
        const mockClient = { id: '1', jobs: [] };
        const deletedClient = { id: '1', full_name: 'Minta Máté' };

        prisma.clients.findUnique.mockResolvedValue(mockClient);
        prisma.clients.delete.mockResolvedValue(deletedClient);

        // Act
        const result = await clientService.deleteClient('1');

        // Assert
        expect(result).toEqual(deletedClient);

        expect(prisma.ac_units.deleteMany).not.toHaveBeenCalled();
        expect(prisma.reference_image.deleteMany).not.toHaveBeenCalled();
        expect(prisma.jobs.deleteMany).not.toHaveBeenCalled();

        expect(prisma.clients.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should delete associated jobs if client has only completed jobs', async () => {
        // Arrange
        const mockClient = {
            id: '1',
            jobs: [
                { id: 'job1', is_completed: true },
                { id: 'job2', is_completed: true }
            ]
        };
        const deletedClient = { id: '1', full_name: 'Minta Máté' };

        prisma.clients.findUnique.mockResolvedValue(mockClient);
        prisma.clients.delete.mockResolvedValue(deletedClient);

        // Act
        const result = await clientService.deleteClient('1');

        // Assert
        expect(result).toEqual(deletedClient);
        expect(prisma.jobs.deleteMany).toHaveBeenCalledWith({ where: { client_id: '1' } });
        expect(prisma.clients.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
});