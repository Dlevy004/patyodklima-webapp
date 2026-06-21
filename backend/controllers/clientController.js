const clientService = require('../services/clientService');

const createClient = async (req, res) => {
    try {
        const newClient = req.body;
        const createdClient = await clientService.createClient(newClient);
        res.status(201).json(createdClient);
    }
    catch (error) {
        console.error('Error while creating client:', error.message);
        res.status(400).json({ message: 'An error occurred while creating client.' })
    }
}

const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.status(200).json(clients);
    }
    catch (error) {
        console.error('Error while getting all clients:', error.message);
        res.status(500).json({ message: 'An error occurred while getting clients.' });
    }
}

const getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await clientService.getClientById(clientId);
        res.status(200).json(client);
    }
    catch (error) {
        console.error('Error while getting client by ID:', error.message);
        res.status(500).json({ message: 'An error occurred while getting client.' })
    }
}

module.exports = {
    createClient,
    getAllClients,
    getClientById
};