const visualDesignService = require('../services/visualDesignService');


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
        const commonPrompt = 'Match the original perspective, scale, lighting, shadows and wall texture. Do not add extra devices, text, logos or watermarks. Preserve everything outside the selected region.';

        if (placementType === 'indoor') {
            aiPrompt = `Add exactly one realistic, modern white indoor wall-mounted split air conditioner. Place it high on the interior wall in the selected region. ${commonPrompt}`;
        } else if (placementType === 'outdoor') {
            aiPrompt = `Add exactly one realistic outdoor HVAC unit with a protective grille. Align it naturally with the exterior wall. ${commonPrompt}`;
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

module.exports = {
    generateDesign
};