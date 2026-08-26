const jobService = require('../services/jobService');


const createJob = async (req, res) => {
    try {
        const newJob = req.body;
        const createdJob = await jobService.createJob(newJob);
        res.status(201).json(createdJob);
    }
    catch (error) {
        console.error('Error while creating job:', error.message);
        res.status(400).json({ message: 'Hiba történt a munka létrehozása során.' });
    }
}

const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error('Error while getting all jobs:', error.message);
        res.status(500).json({ message: 'Hiba történt a munkák lekérése során.' });
    }
}

const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobService.getJobById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'A munka nem található.' });
        }
        res.status(200).json(job);
    }
    catch (error) {
        console.error('Error while getting job by ID:', error.message);
        res.status(500).json({ message: 'Hiba történt a munka lekérése közben.' });
    }
}

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobToUpdate = req.body;

        const existingJob = await jobService.getJobById(jobId);
        if (!existingJob) {
            return res.status(404).json({ message: 'A munka nem található.' });
        }

        const updatedJob = await jobService.updateJob(jobId, jobToUpdate);

        res.status(200).json(updatedJob);
    }
    catch (error) {
        console.error('Error while updating job:', error.message);
        res.status(400).json({ message: 'Hiba történt a munka módosítása során.' });
    }
}

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const existingJob = await jobService.getJobById(jobId);
        if (!existingJob) {
            return res.status(404).json({ message: 'A munka nem található.' });
        }

        const deletedJob = await jobService.deleteJob(jobId);
        res.status(200).json(deletedJob);
    }
    catch (error) {
        console.error('Error while deleting job:', error.message);
        res.status(400).json({ message: 'Hiba történt a munka törlése során.' });
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};