const sharp = require('sharp');

const marketingService = require('../services/marketingService');
const supabaseService = require('../services/supabaseService');


const getTemplates = async (_req, res) => {
    try {
        const templates = await marketingService.getAllTemplates();
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error while getting marketing templates:', error.message);
        res.status(500).json({ message: 'Hiba történt a sablonok lekérése közben.' });
    }
};

const getMarketingAcUnits = async (_req, res) => {
    try {
        const units = await marketingService.getAllMarketingAcUnits();
        res.status(200).json(units);
    } catch (error) {
        console.error('Error while getting marketing AC units:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetés készülékek lekérése közben.' });
    }
};

const getAllMarketings = async (req, res) => {
    try {
        const marketings = await marketingService.getAllMarketings(req.user.id);
        res.status(200).json(marketings);
    } catch (error) {
        console.error('Error while getting generated marketings:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetések lekérése közben.' });
    }
};

const parseFlag = (value) => {
    if (value === undefined) return undefined;
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
};

const generateMarketing = async (req, res) => {
    try {
        const file = req.file;
        const {
            templateId, headline, acUnitName,
            details, fullPrice, showLogo, showPhone
        } = req.body;

        if (!file) {
            return res.status(400).json({ message: 'A generált kép feltöltése kötelező.' });
        }

        if (!acUnitName || !fullPrice) {
            return res.status(400).json({ message: 'A készülék típusa és az ár megadása kötelező.' });
        }

        const priceText = String(fullPrice);
        const parsedPrice = Number(priceText);

        if (!/^\d+$/.test(priceText)
            || !Number.isSafeInteger(parsedPrice)
            || parsedPrice > 2147483647
        ) {
            return res.status(400).json({ message: 'Érvénytelen ár.' });
        }

        const parsedShowLogo = parseFlag(showLogo);
        const parsedShowPhone = parseFlag(showPhone);

        if (parsedShowLogo === null || parsedShowPhone === null) {
            return res.status(400).json({ message: 'A showLogo és showPhone mező csak true/false lehet.' });
        }

        const generatedImageUrl = await supabaseService.uploadImage(file, 'Marketing');

        let marketing;
        try {
            marketing = await marketingService.createMarketing(req.user.id, {
                templateId: templateId || null,
                headline: headline || null,
                acUnitName,
                details: details || null,
                fullPrice: parsedPrice,
                showLogo: parsedShowLogo,
                showPhone: parsedShowPhone,
                generatedImageUrl
            });
        } catch (createError) {
            await supabaseService.deleteImage(generatedImageUrl, 'Marketing').catch(console.error);
            throw createError;
        }

        res.status(200).json(marketing);
    } catch (error) {
        console.error('Error while generating marketing:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetés mentése során.' });
    }
};

const downloadMarketing = async (req, res) => {
    try {
        const marketingId = req.params.id;
        const marketing = await marketingService.getMarketingById(marketingId, req.user.id);

        if (!marketing) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        if (!marketing.generated_image_url) {
            return res.status(404).json({ message: 'Nincs letölthető kép ehhez a hirdetéshez.' });
        }

        const urlObj = new URL(marketing.generated_image_url);
        if (!urlObj.hostname.includes('supabase.co')) {
            return res.status(403).json({ message: 'Biztonsági okokból a letöltés megtagadva: érvénytelen forrás.' });
        }

        const imageResponse = await fetch(marketing.generated_image_url, {
            redirect: 'error',
            signal: AbortSignal.timeout(15000)
        });
        if (!imageResponse.ok) {
            throw new Error(`Sikertelen letöltés a tárhelyről: ${imageResponse.statusText}`);
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        const fileName = `hirdetes-${marketingId}.png`;

        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        res.send(pngBuffer);
    } catch (error) {
        console.error('Error while downloading marketing:', error.message);
        res.status(500).json({ message: 'Hiba történt a kép letöltése során.' });
    }
};

const deleteMarketing = async (req, res) => {
    try {
        const marketingId = req.params.id;
        const existingMarketing = await marketingService.getMarketingById(marketingId, req.user.id);

        if (!existingMarketing) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        const deleted = await marketingService.deleteMarketing(marketingId, req.user.id);
        if (!deleted) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        if (existingMarketing.generated_image_url) {
            await supabaseService.deleteImage(existingMarketing.generated_image_url, 'Marketing')
            .catch((err) => console.error(`Orphaned marketing image cleanup failed for ${marketingId}:`, err.message));
        }

        res.status(200).json({ id: marketingId });
    } catch (error) {
        console.error('Error while deleting marketing:', error.message);
        res.status(400).json({ message: 'Hiba történt a hirdetés törlése közben.' });
    }
};

module.exports = {
    getTemplates,
    getMarketingAcUnits,
    getAllMarketings,
    generateMarketing,
    downloadMarketing,
    deleteMarketing
};
