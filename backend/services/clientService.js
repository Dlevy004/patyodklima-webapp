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

const updateClient = async (id, updatedClient) => {
    return await prisma.clients.update({
        where: {
            id: id
        },
        data: {
            full_name: updatedClient.full_name,
            phone: updatedClient.phone,
            email: updatedClient.email,
            zip_code: updatedClient.zip_code,
            city: updatedClient.city,
            street_address: updatedClient.street_address,
            type: updatedClient.type,
            notes: updatedClient.notes
        }
    })
}

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient
};