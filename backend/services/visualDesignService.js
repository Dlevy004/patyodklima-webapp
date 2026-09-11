const { PrismaClient } = require('@prisma/client');

const supabaseService = require('./supabaseService');

const prisma = new PrismaClient();

const createPendingDesign = async (userId, placementType) => {
    return await prisma.ai_visual_designs.create({
        data: {
            user_id: userId,
            original_image_url: 'uploading...',
            placement_type: placementType,
            status: 'pending'
        }
    });
};

const processAndSaveDesign = async (designId, originalBuffer, maskBuffer, prompt, originalFileObj) => {
    try {
        const cfResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-inpainting`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    image: [...originalBuffer],
                    mask: [...maskBuffer]
                })
            }
        );

        if (!cfResponse.ok) {
            const errorText = await cfResponse.text();
            throw new Error(`Cloudflare AI hiba: ${cfResponse.status} - ${errorText}`);
        }

        const generatedImageArrayBuffer = await cfResponse.arrayBuffer();
        const generatedImageBuffer = Buffer.from(generatedImageArrayBuffer);

        const originalImageUrl = await supabaseService.uploadImage(originalFileObj);

        const generatedFileObj = {
            buffer: generatedImageBuffer,
            originalname: `generated-design-${designId}.png`,
            mimetype: 'image/png'
        };
        const generatedImageUrl = await supabaseService.uploadImage(generatedFileObj);

        const updatedDesign = await prisma.ai_visual_designs.update({
            where: { id: designId },
            data: {
                original_image_url: originalImageUrl,
                generated_image_url: generatedImageUrl,
                status: 'completed'
            }
        });

        return updatedDesign;

    } catch (error) {
        await prisma.ai_visual_designs.update({
            where: { id: designId },
            data: { status: 'failed' }
        });
        throw error;
    }
};

module.exports = {
    createPendingDesign,
    processAndSaveDesign
};