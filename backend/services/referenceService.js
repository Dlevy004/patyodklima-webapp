const prisma = require('../database/prisma')

const createReference = async (newReference) => {
    return await prisma.reference_image.create({
        data: {
            //TODO: job_id placeholder
            "image_url": newReference.image_url,
            "description": newReference.description,
            "is_visible": newReference.is_visible
        }
    });
}

const getAllReferences = async () => {
    return await prisma.reference_image.findMany({
        orderBy: {
            created_at: 'desc'
        }
    });
}

const getReferenceById = async (id) => {
    return await prisma.reference_image.findUnique({ where: { id: id } });
}

const updateReference = async (id, updatedReference) => {
    return await prisma.reference_image.update({
        where: {
            id: id
        },
        data: {
            "image_url": updatedReference.image_url,
            "description": updatedReference.description,
            "is_visible": updatedReference.is_visible
        }
    })
}

const deleteReference = async (id) => {
    return await prisma.reference_image.delete({ where: { id: id } })
}

module.exports = {
    createReference,
    getAllReferences,
    getReferenceById,
    updateReference,
    deleteReference
};