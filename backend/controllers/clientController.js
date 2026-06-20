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

module.exports = {
    getAllClients
};