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
    const existingCompany = await prisma.company.findFirst();

    const dbData = {
        name: data.name,
        headquarters: data.headquarters,
        registration_number: data.registrationNumber,
        tax_number: data.taxNumber,
        f_gas_number: data.fGasNumber,
        phone_number: data.phoneNumber,
        email: data.email,
    };

    let updatedCompany;

    if (existingCompany) {
        updatedCompany = await prisma.company.update({
            where: { id: existingCompany.id },
            data: dbData,
        });
    } else {
        updatedCompany = await prisma.company.create({
            data: dbData,
        });
    }

    return sanitizeCompany(updatedCompany);
};

module.exports = {
    getCompany,
    updateCompany
};