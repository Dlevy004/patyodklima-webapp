const supabase = require('../config/supabase');


const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;

    const { data, error } = await supabase.storage
        .from('References')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
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