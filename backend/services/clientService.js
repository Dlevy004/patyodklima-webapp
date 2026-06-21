const prisma = require('../database/prisma');

const createClient = async (newClient) => {
    return await prisma.clients.create({
        data: {
            full_name: newClient.full_name,
            phone: newClient.phone,
            email: newClient.email,
            zip_code: newClient.zip_code,
            city: newClient.city,
            street_address: newClient.street_address,
            type: newClient.type || "individual",
            notes: newClient.notes
        }
    });
}

const getAllClients = async () => {
    return await prisma.clients.findMany();
}

const getClientById = async (id) => {
    return await prisma.clients.findUnique({
        where: {
            id: id
        }
    });
}

module.exports = {
    createClient,
    getAllClients,
    getClientById
};