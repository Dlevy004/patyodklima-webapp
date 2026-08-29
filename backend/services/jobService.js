const { client_type } = require('@prisma/client');
const prisma = require('../database/prisma');


const createJob = async (newJob) => {
    const calculatedUnitPrice = (newJob.total_amount || 0) - (newJob.labor_fee || 0);

    return await prisma.jobs.create({
        data: {
            client_id: newJob.client_id,
            category: newJob.category,
            job_date: new Date(newJob.job_date),
            internal_notes: newJob.internal_notes,
            general_notes: newJob.general_notes,
            labor_fee: newJob.labor_fee,
            total_amount: newJob.total_amount,

            ...(newJob.ac_unit && {
                ac_units: {
                    create: {
                        model_name: newJob.ac_unit,
                        unit_price: calculatedUnitPrice > 0 ? calculatedUnitPrice : 0
                    }
                }
            })
        }
    });
}

const getAllJobs = async () => {
    return await prisma.jobs.findMany({
        include: {
            clients: true,
            ac_units: true
        },
        orderBy: { created_at: 'desc' }
    });
}

const getJobById = async (id) => {
    return await prisma.jobs.findUnique({
        where: { id: id },
        include: {
            clients: true,
            ac_units: true
        }
    });
}

const updateJob = async (id, updatedJob) => {
    const calculatedUnitPrice = (updatedJob.total_amount || 0) - (updatedJob.labor_fee || 0);

    return await prisma.jobs.update({
        where: {
            id: id
        },
        data: {
            client_id: updatedJob.client_id,
            category: updatedJob.category,
            job_date: updatedJob.job_date ? new Date(updatedJob.job_date) : undefined,
            internal_notes: updatedJob.internal_notes,
            general_notes: updatedJob.general_notes,
            labor_fee: updatedJob.labor_fee,
            total_amount: updatedJob.total_amount,
            is_completed: updatedJob.is_completed,

            ...(updatedJob.ac_unit && {
                ac_units: {
                    deleteMany: {},
                    create: {
                        model_name: updatedJob.ac_unit,
                        unit_price: calculatedUnitPrice > 0 ? calculatedUnitPrice : 0
                    }
                }
            })
        }
    })
}

const deleteJob = async (id) => {
    return await prisma.jobs.delete({ where: { id: id } })
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};