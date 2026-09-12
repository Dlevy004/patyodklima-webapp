const sharp = require('sharp');
const prisma = require('../database/prisma');

const supabaseService = require('./supabaseService');

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
        // Analyse the original image to get its dimensions
        const metadata = await sharp(originalBuffer).metadata();

        // Search for the white box in the mask to determine the crop area
        const trimmedMask = await sharp(maskBuffer)
            .trim({ threshold: 40 })
            .toBuffer({ resolveWithObject: true });

        let cropLeft = 0;
        let cropTop = 0;
        let cropSize = Math.min(metadata.width, metadata.height);

        // If the mask has a white box, we can use its position and size to determine the crop area
        if (trimmedMask.info.trimOffsetLeft !== undefined) {
            const boxWidth = trimmedMask.info.width;
            const boxHeight = trimmedMask.info.height;

            const boxLeft = Math.abs(trimmedMask.info.trimOffsetLeft);
            const boxTop = Math.abs(trimmedMask.info.trimOffsetTop);

            const cx = boxLeft + boxWidth / 2;
            const cy = boxTop + boxHeight / 2;

            // It is larger than the box, because we want to give some space around the box for the AI to work with
            let size = Math.max(boxWidth, boxHeight) * 1.5;
            size = Math.min(size, metadata.width, metadata.height);
            size = Math.floor(size);

            cropLeft = Math.floor(cx - size / 2);
            cropTop = Math.floor(cy - size / 2);
            cropSize = size;

            // Ensure the crop area is within the bounds of the original image
            if (cropLeft < 0) cropLeft = 0;
            if (cropTop < 0) cropTop = 0;
            if (cropLeft + cropSize > metadata.width) cropLeft = metadata.width - cropSize;
            if (cropTop + cropSize > metadata.height) cropTop = metadata.height - cropSize;
        }

        const extractOpts = { left: cropLeft, top: cropTop, width: cropSize, height: cropSize };

        // Extract the cropped region from the original image and mask, then resize to 512x512 for Cloudflare AI
        const croppedOriginal512 = await sharp(originalBuffer)
            .extract(extractOpts)
            .resize(512, 512)
            .toBuffer();

        const croppedMask512 = await sharp(maskBuffer)
            .extract(extractOpts)
            .resize(512, 512)
            .threshold(128)
            .png()
            .toBuffer();

        // Fetch the Cloudflare AI API for inpainting
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