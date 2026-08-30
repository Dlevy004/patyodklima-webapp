const prisma = require('../database/prisma');
const jobService = require('../services/jobService');


jest.mock('../database/prisma', () => ({
    jobs: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}));

describe('jobService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createJob', () => {
        it('should create a new job without ac_unit if not provided', async () => {
            // Arrange
            const newJob = {
                client_id: 'client-1',
                category: 'survey',
                job_date: '2026-05-10',
                internal_notes: 'Belső jegyzet',
                general_notes: 'Általános jegyzet',
                labor_fee: 10000,
                total_amount: 10000
            };
            const createdJob = { id: 'job-1', ...newJob };
            prisma.jobs.create.mockResolvedValue(createdJob);

            // Act
            const result = await jobService.createJob(newJob);

            // Assert
            expect(result).toEqual(createdJob);
            expect(prisma.jobs.create).toHaveBeenCalledTimes(1);
            expect(prisma.jobs.create).toHaveBeenCalledWith({
                data: {
                    client_id: newJob.client_id,
                    category: newJob.category,
                    job_date: new Date(newJob.job_date),
                    internal_notes: newJob.internal_notes,
                    general_notes: newJob.general_notes,
                    labor_fee: newJob.labor_fee,
                    total_amount: newJob.total_amount
                }
            });
        });

        it('should fallback to 0 for missing amounts and prevent negative unit_price', async () => {
            const newJob = {
                client_id: 'client-1',
                ac_unit: 'Teszt Klíma'
            };
            prisma.jobs.create.mockResolvedValue({ id: 'job-x' });

            await jobService.createJob(newJob);

            expect(prisma.jobs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ac_units: {
                            create: expect.objectContaining({ unit_price: 0 })
                        }
                    })
                })
            );
        });

        it('should create a new job with ac_unit and calculate positive unit_price', async () => {
            // Arrange
            const newJob = {
                client_id: 'client-1',
                category: 'installation',
                job_date: '2026-05-10',
                labor_fee: 50000,
                total_amount: 350000,
                ac_unit: 'Midea Xtreme'
            };
            prisma.jobs.create.mockResolvedValue({ id: 'job-2' });

            // Act
            await jobService.createJob(newJob);

            // Assert
            expect(prisma.jobs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ac_units: {
                            create: {
                                model_name: 'Midea Xtreme',
                                unit_price: 300000
                            }
                        }
                    })
                })
            );
        });

        it('should fallback unit_price to 0 if calculation is negative or data is missing', async () => {
            // Arrange
            const newJob = {
                client_id: 'client-1',
                job_date: '2026-05-10',
                labor_fee: 50000,
                total_amount: 20000,
                ac_unit: 'Hibás Árazású Klíma'
            };
            prisma.jobs.create.mockResolvedValue({ id: 'job-3' });

            // Act
            await jobService.createJob(newJob);

            // Assert
            expect(prisma.jobs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ac_units: {
                            create: {
                                model_name: 'Hibás Árazású Klíma',
                                unit_price: 0
                            }
                        }
                    })
                })
            );
        });
    });

    describe('getAllJobs', () => {
        it('should return all jobs with nested clients and ac_units ordered by date', async () => {
            const mockJobs = [{ id: '1' }, { id: '2' }];
            prisma.jobs.findMany.mockResolvedValue(mockJobs);

            const result = await jobService.getAllJobs();

            expect(result).toEqual(mockJobs);
            expect(prisma.jobs.findMany).toHaveBeenCalledWith({
                include: { clients: true, ac_units: true },
                orderBy: { created_at: 'desc' }
            });
        });
    });

    describe('getJobById', () => {
        it('should return a job by ID', async () => {
            const mockJob = { id: 'job-1', category: 'cleaning' };
            prisma.jobs.findUnique.mockResolvedValue(mockJob);

            const result = await jobService.getJobById('job-1');

            expect(result).toEqual(mockJob);
            expect(prisma.jobs.findUnique).toHaveBeenCalledWith({
                where: { id: 'job-1' },
                include: { clients: true, ac_units: true }
            });
        });

        it('should return null if job does not exist', async () => {
            prisma.jobs.findUnique.mockResolvedValue(null);
            const result = await jobService.getJobById('invalid-id');
            expect(result).toBeNull();
        });
    });

    describe('updateJob', () => {
        it('should update job properties without touching ac_units if not provided', async () => {
            const updatedJob = {
                client_id: 'client-2',
                category: 'maintenance',
                job_date: '2026-08-20',
                is_completed: true,
                labor_fee: 10000,
                total_amount: 10000
            };
            prisma.jobs.update.mockResolvedValue({ id: 'job-1' });

            await jobService.updateJob('job-1', updatedJob);

            expect(prisma.jobs.update).toHaveBeenCalledWith({
                where: { id: 'job-1' },
                data: {
                    client_id: updatedJob.client_id,
                    category: updatedJob.category,
                    job_date: new Date(updatedJob.job_date),
                    internal_notes: undefined,
                    general_notes: undefined,
                    labor_fee: updatedJob.labor_fee,
                    total_amount: updatedJob.total_amount,
                    is_completed: updatedJob.is_completed
                }
            });
        });

        it('should handle undefined job_date correctly during update', async () => {
            const updatedJob = { total_amount: 5000 };
            prisma.jobs.update.mockResolvedValue({ id: 'job-1' });

            await jobService.updateJob('job-1', updatedJob);

            expect(prisma.jobs.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        job_date: undefined
                    })
                })
            );
        });

        it('should fallback to 0 for missing amounts and prevent negative unit_price during update', async () => {
            const updatedJob = {
                ac_unit: 'Teszt Klíma'
            };
            prisma.jobs.update.mockResolvedValue({ id: 'job-1' });

            await jobService.updateJob('job-1', updatedJob);

            expect(prisma.jobs.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ac_units: {
                            deleteMany: {},
                            create: expect.objectContaining({ unit_price: 0 })
                        }
                    })
                })
            );
        });

        it('should trigger nested ac_units deleteMany and create when ac_unit is provided', async () => {
            const updatedJob = {
                labor_fee: 40000,
                total_amount: 240000,
                ac_unit: 'AUX'
            };
            prisma.jobs.update.mockResolvedValue({ id: 'job-1' });

            await jobService.updateJob('job-1', updatedJob);

            expect(prisma.jobs.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ac_units: {
                            deleteMany: {},
                            create: {
                                model_name: 'AUX',
                                unit_price: 200000
                            }
                        }
                    })
                })
            );
        });
    });

    describe('deleteJob', () => {
        it('should delete a job if exists', async () => {
            const mockDeleted = { id: 'job-1' };
            prisma.jobs.delete.mockResolvedValue(mockDeleted);

            const result = await jobService.deleteJob('job-1');

            expect(result).toEqual(mockDeleted);
            expect(prisma.jobs.delete).toHaveBeenCalledWith({ where: { id: 'job-1' } });
        });
    });
});