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

        let metadata;

        try {
            metadata = await sharp(file.buffer).metadata();
        } catch {
            return res.status(415).json({ message: 'A feltöltött fájl nem érvényes képfájl.' });
        }

        const allowedFormats = new Set(['jpeg', 'png', 'webp', 'avif']);

        if (!allowedFormats.has(metadata.format) || !metadata.width || !metadata.height) {
            return res.status(415).json({ message: 'Nem támogatott képformátum.' });
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

const getPublicReferences = async (_req, res) => {
    try {
        const references = await referenceService.getVisibleReferences();
        return res.status(200).json(references);
    } catch (error) {
        console.error('Error while getting public references:', error.message);
        return res.status(500).json({ message: 'Hiba történt a referenciaképek lekérése közben.' });
    }
};

const getAllReferences = async (_req, res) => {
    try {
        const references = await referenceService.getAllReferences();
        return res.status(200).json(references);
    } catch (error) {
        console.error('Error while getting all references:', error.message);
        return res.status(500).json({ message: 'Hiba történt a referenciaképek lekérése közben.' });
    }
};

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

        const { description, is_visible } = req.body;
        const referenceToUpdate = {
            description: description,
            is_visible: is_visible
        };

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

        await supabaseService.deleteImage(existingReference.image_url);

        const deletedReference = await referenceService.deleteReference(referenceId);

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

        const urlObj = new URL(reference.image_url);
        if (!urlObj.hostname.includes('supabase.co')) {
            return res.status(403).json({ message: 'Biztonsági okokból a letöltés megtagadva: érvénytelen forrás.' });
        }

        const imageResponse = await fetch(reference.image_url, {
            redirect: 'error',
            signal: AbortSignal.timeout(15000)
        });

        if (!imageResponse.ok) {
            throw new Error(`Sikertelen letöltés a tárhelyről: ${imageResponse.statusText}`);
        }

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
    downloadReference,
    getPublicReferences
};