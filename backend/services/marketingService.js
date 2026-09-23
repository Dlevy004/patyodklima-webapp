const prisma = require('../database/prisma');


const getAllTemplates = async () => {
    return prisma.marketing_templates.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
};

const getAllMarketingAcUnits = async () => {
    return prisma.ac_units.findMany({
        orderBy: [{ brand: 'asc' }, { model_name: 'asc' }]
    });
};

const getAllMarketings = async (userId) => {
    return prisma.generated_marketings.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        include: {
            marketing_templates: {
                select: { name: true, category: true }
            }
        }
    });
};

const getMarketingById = async (marketingId, userId) => {
    return prisma.generated_marketings.findFirst({
        where: { id: marketingId, user_id: userId }
    });
};

const createMarketing = async (userId, data) => {
    return prisma.generated_marketings.create({
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

const deleteMarketing = async (marketingId, userId) => {
    const { count } = await prisma.generated_marketings.deleteMany({
        where: { id: marketingId, user_id: userId }
    });
    return count > 0;
};

module.exports = {
    getAllTemplates,
    getAllMarketingAcUnits,
    getAllMarketings,
    getMarketingById,
    createMarketing,
    deleteMarketing
};
