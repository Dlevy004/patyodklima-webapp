const supabase = require('../config/supabase');
const sharp = require('sharp');


const uploadImage = async (file) => {
    const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

    const originalNameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
    const safeName = originalNameWithoutExt.replace(/\s/g, '_');
    const fileName = `${Date.now()}-${safeName}.webp`;

    const { data, error } = await supabase.storage
        .from('References')
        .upload(fileName, optimizedBuffer, {
            contentType: 'image/webp',
        });

    if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('References')
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};

const deleteImage = async (imageUrl) => {
    const fileName = imageUrl.split('/').pop();

    const { error } = await supabase.storage
        .from('References')
        .remove([fileName]);

    if (error) {
        console.error(`Supabase delete error: ${error.message}`);
    }
};

module.exports = {
    uploadImage,
    deleteImage
};