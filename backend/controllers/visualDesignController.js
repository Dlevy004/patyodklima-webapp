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

module.exports = {
    generateDesign
};