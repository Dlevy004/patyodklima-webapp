const prisma = require('../database/prisma');


const createJob = async (newJob) => {
    return await prisma.jobs.create({
        data: {
            category: newJob.category,
            job_date: new Date(newJob.job_date),
            internal_notes: newJob.internal_notes,
            general_notes: newJob.general_notes,
            labor_fee: newJob.labor_fee,
            total_amount: newJob.total_amount,
            ac_unit: newJob.ac_unit,

            ...(newJob.client_id && {
                clients: {
                    connect: { id: newJob.client_id }
                }
            })
        }
    });
}

const getAllJobs = async () => {
    return await prisma.jobs.findMany({
        include: {
            clients: true
        },
        orderBy: { created_at: 'desc' }
    });
}

const getJobById = async (id) => {
    return await prisma.jobs.findUnique({
        where: { id: id },
        include: {
            clients: true
        }
    });
}

const updateJob = async (id, updatedJob) => {
    return await prisma.jobs.update({
        where: { id: id },
        data: {
            category: updatedJob.category,
            job_date: updatedJob.job_date ? new Date(updatedJob.job_date) : undefined,
            internal_notes: updatedJob.internal_notes,
            general_notes: updatedJob.general_notes,
            labor_fee: updatedJob.labor_fee,
            total_amount: updatedJob.total_amount,
            is_completed: updatedJob.is_completed,
            ac_unit: updatedJob.ac_unit,

            ...(updatedJob.client_id && {
                clients: {
                    connect: { id: updatedJob.client_id }
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