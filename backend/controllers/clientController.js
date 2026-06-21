const clientService = require('../services/clientService');

const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.status(200).json(clients);
    }
    catch (error) {
        console.error('Error while getting all clients:', error);
        res.status(500).json({ error: 'An error occurred while getting clients.' });
    }
}

const getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await clientService.getClientById(clientId);
        res.status(200).json(client);
    }
    catch (error) {
        console.error('Error while getting client by ID:', error);
        res.status(500).json({ error: 'An error occurred while getting client.' })
    }
}

module.exports = {
    getAllClients,
    getClientById
};