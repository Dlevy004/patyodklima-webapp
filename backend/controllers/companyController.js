const companyService = require('../services/companyService');


const getCompanyData = async (req, res) => {
    try {
        const company = await companyService.getCompany();

        if (!company) {
            return res.status(200).json({ company: {} });
        }

        return res.status(200).json({ company });
    } catch (error) {
        console.error('Error fetching company data:', error.message);
        return res.status(500).json({ message: 'Hiba történt a cégadatok lekérése közben.' });
    }
};

const updateCompanyData = async (req, res) => {
    try {
        const {
            name, headquarters, registrationNumber,
            taxNumber, fGasNumber, phoneNumber, email
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'A név és az email cím megadása kötelező!' });
        }

        const updatedCompany = await companyService.updateCompany({
            name,
            headquarters,
            registrationNumber,
            taxNumber,
            fGasNumber,
            phoneNumber,
            email
        });

        return res.status(200).json({
            message: 'Cégadatok sikeresen frissítve!',
            company: updatedCompany
        });
    } catch (error) {
        console.error('Error updating company data:', error.message);
        return res.status(500).json({ message: 'Hiba történt a cégadatok frissítése közben.' });
    }
};

module.exports = {
    getCompanyData,
    updateCompanyData
};