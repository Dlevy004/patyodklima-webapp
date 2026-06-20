const prisma = require('../database/prisma');

const getAllClients = async () => {
    return await prisma.clients.findMany();
}

module.exports = {
    getAllClients
};