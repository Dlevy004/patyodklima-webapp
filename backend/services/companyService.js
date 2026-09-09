const prisma = require('../database/prisma');


const sanitizeCompany = (company) => {
    if (!company) return null;
    return {
        id: company.id,
        name: company.name,
        headquarters: company.headquarters,
        registrationNumber: company.registration_number,
        taxNumber: company.tax_number,
        fGasNumber: company.f_gas_number,
        phoneNumber: company.phone_number,
        email: company.email,
    };
};

const getCompany = async () => {
    const company = await prisma.company.findFirst();
    return sanitizeCompany(company);
};

const updateCompany = async (data) => {
    const companyId = 'default-company-id';

    const updatedCompany = await prisma.company.upsert({
        where: { id: companyId },
        update: {
            name: data.name,
            headquarters: data.headquarters,
            registration_number: data.registrationNumber,
            tax_number: data.taxNumber,
            f_gas_number: data.fGasNumber,
            phone_number: data.phoneNumber,
            email: data.email
        },
        create: {
            id: companyId,
            name: data.name,
            headquarters: data.headquarters,
            registration_number: data.registrationNumber,
            tax_number: data.taxNumber,
            f_gas_number: data.fGasNumber,
            phone_number: data.phoneNumber,
            email: data.email
        }
    });

    return updatedCompany;
};

module.exports = {
    getCompany,
    updateCompany
};