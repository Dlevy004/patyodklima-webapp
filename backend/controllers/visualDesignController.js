const sharp = require('sharp');

const visualDesignService = require('../services/visualDesignService');
const supabaseService = require('../services/supabaseService');


const getAllDesigns = async (req, res) => {
    try {
        const designs = await visualDesignService.getAllDesigns(req.user.id);
        res.status(200).json(designs);
    } catch (error) {
        console.error('Error while getting visual designs:', error.message);
        res.status(500).json({ message: 'Hiba történt a látványtervek lekérése közben.' });
    }
};

const downloadDesign = async (req, res) => {
    try {
        const designId = req.params.id;
        const design = await visualDesignService.getDesignById(designId, req.user.id);

        if (!design) {
            return res.status(404).json({ message: 'A látványterv nem található.' });
        }

        const imageUrl = design.generated_image_url || design.original_image_url;
        if (!imageUrl) {
            return res.status(404).json({ message: 'Nincs letölthető kép ehhez a látványtervhez.' });
        }

        const urlObj = new URL(imageUrl);
        if (!urlObj.hostname.includes('supabase.co')) {
            return res.status(403).json({ message: 'Biztonsági okokból a letöltés megtagadva: érvénytelen forrás.' });
        }

        const imageResponse = await fetch(imageUrl, {
            redirect: 'error',
            signal: AbortSignal.timeout(15000)
        });
        if (!imageResponse.ok) {
            throw new Error(`Sikertelen letöltés a tárhelyről: ${imageResponse.statusText}`);
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();

        const fileName = `latvanyterv-${designId}.png`;

        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        res.send(pngBuffer);
    } catch (error) {
        console.error('Error while downloading visual design:', error.message);
        res.status(500).json({ message: 'Hiba történt a kép letöltése során.' });
    }
};

const generateDesign = async (req, res) => {
    try {
        const files = req.files;
        const { placementType } = req.body;
        const userId = req.user.id;

        if (!files || !files.image || !files.mask) {
            return res.status(400).json({ message: 'The original image and mask are required!' });
        }

        const originalImageBuffer = files.image[0].buffer;
        const maskImageBuffer = files.mask[0].buffer;

        let aiPrompt = '';
        const commonPrompt = 'Match the original perspective, lighting, and shadows. Photorealistic architectural photography.';

        if (placementType === 'indoor') {
            aiPrompt = `A standard white indoor split air conditioner mounted on the wall, clean minimalist white plastic, realistic home appliance. ${commonPrompt}`;
        } else if (placementType === 'outdoor') {
            aiPrompt = `A large square metal outdoor air conditioner compressor unit, exterior HVAC motor with a large circular fan grille, realistic building equipment. ${commonPrompt}`;
        } else {
            return res.status(400).json({ message: 'Invalid placement type. (indoor/outdoor)' });
        }

        const pendingDesign = await visualDesignService.createPendingDesign(userId, placementType);

        const completedDesign = await visualDesignService.processAndSaveDesign(
            pendingDesign.id,
            originalImageBuffer,
            maskImageBuffer,
            aiPrompt,
            files.image[0]
        );

        res.status(200).json(completedDesign);

    } catch (error) {
        console.error('Error in generateDesign controller:', error.message);
        res.status(500).json({ message: 'Error occurred while generating the visual design.' });
    }
};

const deleteDesign = async (req, res) => {
    try {
        const designId = req.params.id;

        const existingDesign = await visualDesignService.getDesignById(designId, req.user.id);
        if (!existingDesign) {
            return res.status(404).json({ message: 'A látványterv nem található.' });
        }

        if (existingDesign.original_image_url) {
            await supabaseService.deleteImage(existingDesign.original_image_url, 'VisualDesign').catch(console.error);
        }
        if (existingDesign.generated_image_url) {
            await supabaseService.deleteImage(existingDesign.generated_image_url, 'VisualDesign').catch(console.error);
        }

        const deletedDesign = await visualDesignService.deleteDesign(designId, req.user.id);
        if (!deletedDesign) {
            return res.status(404).json({ message: 'A látványterv nem található.' });
        }

        res.status(200).json(deletedDesign);
    } catch (error) {
        console.error('Error while deleting visual design:', error.message);
        res.status(400).json({ message: 'Hiba történt a látványterv törlése közben.' });
    }
};

module.exports = {
    generateDesign,
    getAllDesigns,
    deleteDesign,
    downloadDesign
};