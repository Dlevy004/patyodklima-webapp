const prisma = require('../database/prisma');


const getAllTemplates = async () => {
    return prisma.ad_templates.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
};

const getAllAdAcUnits = async () => {
    return prisma.ac_units.findMany({
        orderBy: [{ brand: 'asc' }, { model_name: 'asc' }]
    });
};

const getAllAds = async (userId) => {
    return prisma.generated_ads.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        include: {
            ad_templates: {
                select: { name: true, category: true }
            }
        }
    });
};

const getAdById = async (adId, userId) => {
    return prisma.generated_ads.findFirst({
        where: { id: adId, user_id: userId }
    });
};

const createAd = async (userId, data) => {
    return prisma.generated_ads.create({
        data: {
            user_id: userId,
            template_id: data.templateId || null,
            headline: data.headline || null,
            ac_unit_name: data.acUnitName,
            details: data.details || null,
            full_price: data.fullPrice,
            show_logo: data.showLogo ?? true,
            show_phone: data.showPhone ?? true,
            generated_image_url: data.generatedImageUrl
        }
    });
};

const deleteAd = async (adId, userId) => {
    const { count } = await prisma.generated_ads.deleteMany({
        where: { id: adId, user_id: userId }
    });
    return count > 0;
};

module.exports = {
    getAllTemplates,
    getAllAdAcUnits,
    getAllAds,
    getAdById,
    createAd,
    deleteAd
};
