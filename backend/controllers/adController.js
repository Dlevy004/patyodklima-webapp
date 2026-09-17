const sharp = require('sharp');

const adService = require('../services/adService');
const supabaseService = require('../services/supabaseService');


const getTemplates = async (_req, res) => {
    try {
        const templates = await adService.getAllTemplates();
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error while getting ad templates:', error.message);
        res.status(500).json({ message: 'Hiba történt a sablonok lekérése közben.' });
    }
};

const getAdAcUnits = async (_req, res) => {
    try {
        const units = await adService.getAllAdAcUnits();
        res.status(200).json(units);
    } catch (error) {
        console.error('Error while getting ad AC units:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetés készülékek lekérése közben.' });
    }
};

const getAllAds = async (req, res) => {
    try {
        const ads = await adService.getAllAds(req.user.id);
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error while getting generated ads:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetések lekérése közben.' });
    }
};

const generateAd = async (req, res) => {
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

        const parsedPrice = Number.parseInt(fullPrice, 10);
        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: 'Érvénytelen ár.' });
        }

        const generatedImageUrl = await supabaseService.uploadImage(file, 'Ads');

        const ad = await adService.createAd(req.user.id, {
            templateId: templateId || null,
            headline: headline || null,
            acUnitName,
            details: details || null,
            fullPrice: parsedPrice,
            showLogo: showLogo === 'true' || showLogo === true,
            showPhone: showPhone === 'true' || showPhone === true,
            generatedImageUrl
        });

        res.status(200).json(ad);
    } catch (error) {
        console.error('Error while generating ad:', error.message);
        res.status(500).json({ message: 'Hiba történt a hirdetés mentése során.' });
    }
};

const downloadAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const ad = await adService.getAdById(adId, req.user.id);

        if (!ad) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        if (!ad.generated_image_url) {
            return res.status(404).json({ message: 'Nincs letölthető kép ehhez a hirdetéshez.' });
        }

        const urlObj = new URL(ad.generated_image_url);
        if (!urlObj.hostname.includes('supabase.co')) {
            return res.status(403).json({ message: 'Biztonsági okokból a letöltés megtagadva: érvénytelen forrás.' });
        }

        const imageResponse = await fetch(ad.generated_image_url, { redirect: 'error' });
        if (!imageResponse.ok) {
            throw new Error(`Sikertelen letöltés a tárhelyről: ${imageResponse.statusText}`);
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        const fileName = `hirdetes-${adId}.png`;

        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        res.send(pngBuffer);
    } catch (error) {
        console.error('Error while downloading ad:', error.message);
        res.status(500).json({ message: 'Hiba történt a kép letöltése során.' });
    }
};

const deleteAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const existingAd = await adService.getAdById(adId, req.user.id);

        if (!existingAd) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        if (existingAd.generated_image_url) {
            await supabaseService.deleteImage(existingAd.generated_image_url, 'Ads').catch(console.error);
        }

        const deleted = await adService.deleteAd(adId, req.user.id);
        if (!deleted) {
            return res.status(404).json({ message: 'A hirdetés nem található.' });
        }

        res.status(200).json({ id: adId });
    } catch (error) {
        console.error('Error while deleting ad:', error.message);
        res.status(400).json({ message: 'Hiba történt a hirdetés törlése közben.' });
    }
};

module.exports = {
    getTemplates,
    getAdAcUnits,
    getAllAds,
    generateAd,
    downloadAd,
    deleteAd
};
