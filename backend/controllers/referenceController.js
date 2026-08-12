const referenceService = require('../services/referenceService');
const supabaseService = require('../services/supabaseService')


const createReference = async (req, res) => {
    try {
        const file = req.file;
        const { description, is_visible } = req.body;

        if (!file) {
            return res.status(400).json({ message: 'There is no file attached to the request.' });
        }

        const imageUrl = await storageService.uploadImage(file);

        const newReference = {
            image_url: imageUrl,
            description: description,
            is_visible: is_visible === 'true'
        };

        const createdReference = await referenceService.createReference(newReference);
        res.status(201).json(createdReference);
    }
    catch (error) {
        console.error('Error while creating reference image:', error.message);
        res.status(400).json({ message: 'An error occurred while creating reference image.' });
    }
}

const getAllReferences = async (req, res) => {
    try {
        const references = await referenceService.getAllReferences();
        res.status(200).json(references);
    }
    catch (error) {
        console.error('Error while getting all reference images:', error.message);
        res.status(500).json({ message: 'An error occurred while getting reference images.' });
    }
}

const getReferenceById = async (req, res) => {
    try {
        const referenceId = req.params.id;
        const reference = await referenceService.getReferenceById(referenceId);

        if (!reference) {
            return res.status(404).json({ message: 'Reference not found.' });
        }
        res.status(200).json(reference);
    }
    catch (error) {
        console.error('Error while getting reference image by ID:', error.message);
        res.status(500).json({ message: 'An error occurred while getting reference image.' });
    }
}

const updateReference = async (req, res) => {
    try {
        const referenceId = req.params.id;
        const referenceToUpdate = req.body;

        const existingReference = await referenceService.getReferenceById(referenceId);
        if (!existingReference) {
            return res.status(404).json({ message: 'Reference image not found.' });
        }

        const updatedReference = await referenceService.updateReference(referenceId, referenceToUpdate);

        res.status(200).json(updatedReference);
    }
    catch (error) {
        console.error('Error while updating reference image:', error.message);
        res.status(400).json({ message: 'An error occurred while updating reference image.' });
    }
}

const deleteReference = async (req, res) => {
    try {
        const referenceId = req.params.id;

        const existingReference = await referenceService.getReferenceById(referenceId);
        if (!existingReference) {
            return res.status(404).json({ message: 'Reference image not found.' });
        }

        const deletedReference = await referenceService.deleteReference(referenceId);
        await storageService.deleteImage(existingReference.image_url);

        res.status(200).json(deletedReference);
    }
    catch (error) {
        console.error('Error while deleting reference images:', error.message);
        res.status(400).json({ message: 'An error occurred while deleting reference images.' });
    }
}

module.exports = {
    createReference,
    getAllReferences,
    getReferenceById,
    updateReference,
    deleteReference
};