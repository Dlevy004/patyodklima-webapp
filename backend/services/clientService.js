const prisma = require('../database/prisma');

const getAllClients = async () => {
    return await prisma.clients.findMany();
}

const getClientById = async (id) => {
    return await prisma.clients.findUnique({
        where: {
            id: (id)
        }
    });
}

module.exports = {
    getAllClients,
    getClientById
};