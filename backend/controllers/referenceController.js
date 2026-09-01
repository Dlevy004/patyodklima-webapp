const sharp = require('sharp');

const referenceService = require('../services/referenceService');
const supabaseService = require('../services/supabaseService');


const createReference = async (req, res) => {
    try {
        const file = req.file;
        const { description, is_visible } = req.body;

        if (!file) {
            return res.status(400).json({ message: 'A kéréshez nincs fájl csatolva.' });
        }

        const imageUrl = await supabaseService.uploadImage(file);

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
        res.status(400).json({ message: 'Hiba történt a referenciakép létrehozása során.' });
    }
}

const getAllReferences = async (req, res) => {
    try {
        const references = await referenceService.getAllReferences();
        res.status(200).json(references);
    }
    catch (error) {
        console.error('Error while getting all reference images:', error.message);
        res.status(500).json({ message: 'Hiba történt a referenciaképek lekérése közben.' });
    }
}

const getReferenceById = async (req, res) => {
    try {
        const referenceId = req.params.id;
        const reference = await referenceService.getReferenceById(referenceId);

        if (!reference) {
            return res.status(404).json({ message: 'A referenciakép nem található.' });
        }
        res.status(200).json(reference);
    }
    catch (error) {
        console.error('Error while getting reference image by ID:', error.message);
        res.status(500).json({ message: 'Hiba történt a referenciakép lekérése közben.' });
    }
}

const updateReference = async (req, res) => {
    try {
        const referenceId = req.params.id;
        const referenceToUpdate = req.body;

        const existingReference = await referenceService.getReferenceById(referenceId);
        if (!existingReference) {
            return res.status(404).json({ message: 'A referenciakép nem található.' });
        }

        const updatedReference = await referenceService.updateReference(referenceId, referenceToUpdate);

        res.status(200).json(updatedReference);
    }
    catch (error) {
        console.error('Error while updating reference image:', error.message);
        res.status(400).json({ message: 'Hiba történt a referenciakép frissítése közben.' });
    }
}

const deleteReference = async (req, res) => {
    try {
        const referenceId = req.params.id;

        const existingReference = await referenceService.getReferenceById(referenceId);
        if (!existingReference) {
            return res.status(404).json({ message: 'A referenciakép nem található.' });
        }

        const deletedReference = await referenceService.deleteReference(referenceId);
        await supabaseService.deleteImage(existingReference.image_url);

        res.status(200).json(deletedReference);
    }
    catch (error) {
        console.error('Error while deleting reference images:', error.message);
        res.status(400).json({ message: 'Hiba történt a referenciakép törlése közben.' });
    }
}

const downloadReference = async (req, res) => {
    try {
        const referenceId = req.params.id;
        const reference = await referenceService.getReferenceById(referenceId);

        if (!reference) {
            return res.status(404).json({ message: 'A referenciakép nem található.' });
        }

        const imageResponse = await fetch(reference.image_url);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        const pngBuffer = await sharp(imageBuffer).png().toBuffer();

        const fileName = `referencia-${referenceId}.png`;

        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });

        res.send(pngBuffer);
    } catch (error) {
        console.error('Error while downloading reference image:', error.message);
        res.status(500).json({ message: 'Hiba történt a kép letöltése során.' });
    }
}

module.exports = {
    createReference,
    getAllReferences,
    getReferenceById,
    updateReference,
    deleteReference,
    downloadReference
};