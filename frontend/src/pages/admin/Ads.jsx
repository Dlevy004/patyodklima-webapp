import { useCallback, useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import './Ads.css';

import usePageTitle from '@/hooks/usePageTitle';
import useFetch from '@/hooks/useFetch';
import { getAuthHeaders } from '@/utils/api';
import { renderAdToCanvas, downloadCanvasAsPng, canvasToBlob } from '@/utils/adCanvas';
import AdPreview from '@/components/admin/ads/AdPreview';
import AdCreatorSidebar from '@/components/admin/ads/AdCreatorSidebar';
import AdHistory from '@/components/admin/ads/AdHistory';
import horizontalLogo from '@/assets/images/logo.avif';
import phoneNumberImage from '@/assets/images/phoneNumber.png';

const API_URL = import.meta.env.VITE_API_URL;
const TEMPLATES_URL = `${API_URL}/api/ad-templates`;
const AD_AC_UNITS_URL = `${API_URL}/api/ad-ac-units`;
const ADS_URL = `${API_URL}/api/ads`;

const initialFormData = {
    headline: '', acUnitName: '',
    details: '', price: '',
    showLogo: true, showPhone: true,
};


function Ads() {
    usePageTitle('Hirdetések');

    const { data: templatesData } = useFetch(TEMPLATES_URL);
    const { data: acUnitsData } = useFetch(AD_AC_UNITS_URL);

    const templates = templatesData ?? [];
    const acUnits = acUnitsData ?? [];

    const [step, setStep] = useState('templates');
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [selectedAcUnitId, setSelectedAcUnitId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const selectedTemplate = useMemo(
        () => templates.find((item) => item.id === selectedTemplateId) || null,
        [templates, selectedTemplateId]
    );

    const selectedAcUnit = useMemo(
        () => acUnits.find((item) => item.id === selectedAcUnitId) || null,
        [acUnits, selectedAcUnitId]
    );

    const handleSelectTemplate = (templateId) => {
        setSelectedTemplateId(templateId);
    };

    const handleSelectAcUnit = (unitId) => {
        setSelectedAcUnitId(unitId);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const buildCanvas = useCallback(async () => {
        if (!selectedTemplate?.background_image_url) {
            throw new Error('Válassz sablont a hirdetés elkészítéséhez.');
        }

        return renderAdToCanvas({
            templateUrl: selectedTemplate.background_image_url,
            acUnitUrl: selectedAcUnit?.transparent_image_url,
            logoUrl: horizontalLogo,
            phoneImageUrl: phoneNumberImage,
            headline: formData.headline,
            acUnitName: formData.acUnitName,
            details: formData.details,
            price: formData.price,
            showLogo: formData.showLogo,
            showPhone: formData.showPhone,
        });
    }, [selectedTemplate, selectedAcUnit, formData]);

    const handleUndo = () => {
        if (step === 'text') {
            setStep('devices');
            return;
        }

        if (step === 'devices') {
            if (selectedAcUnitId) {
                setSelectedAcUnitId(null);
            } else {
                setStep('templates');
            }
            return;
        }

        if (selectedTemplateId) {
            setSelectedTemplateId(null);
        }
    };

    const handleDelete = () => {
        setStep('templates');
        setSelectedTemplateId(null);
        setSelectedAcUnitId(null);
        setFormData(initialFormData);

        toast.success('A hirdetés alaphelyzetbe állítva.');
    };

    const handleDownload = async () => {
        try {
            const canvas = await buildCanvas();
            const filename = formData.headline
                ? `${formData.headline.replace(/\s+/g, '-').toLowerCase()}.png`
                : 'hirdetes.png';
            await downloadCanvasAsPng(canvas, filename);

            toast.success('A hirdetés letöltése sikeres.');
        } catch (error) {
            console.error(error.message);

            toast.error('Hiba történt a letöltés során.');
        }
    };

    const handleFinish = async () => {
        if (!selectedTemplateId) {
            toast.error('Előbb válassz egy sablont!');
            return;
        }

        if (!selectedAcUnitId) {
            toast.error('Előbb válassz egy készüléket!');
            return;
        }

        if (!formData.acUnitName || formData.price === '') {
            toast.error('A készülék típusa és az ár megadása kötelező.');
            return;
        }

        setIsSaving(true);

        try {
            const canvas = await buildCanvas();
            const blob = await canvasToBlob(canvas);

            const payload = new FormData();
            payload.append('image', blob, 'hirdetes.png');
            payload.append('templateId', selectedTemplateId || '');
            payload.append('headline', formData.headline);
            payload.append('acUnitName', formData.acUnitName);
            payload.append('details', formData.details);
            payload.append('fullPrice', String(formData.price));
            payload.append('showLogo', String(formData.showLogo));
            payload.append('showPhone', String(formData.showPhone));

            const response = await fetch(`${ADS_URL}/generate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: payload,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Hiba történt a hirdetés mentése során.');
            }

            setRefreshKey((prev) => prev + 1);
            toast.success('A hirdetés elkészült!');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Hiba történt a hirdetés mentése során.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='ads-page'>
            <section className='ads-creator'>
                <AdPreview
                    template={selectedTemplate}
                    acUnit={selectedAcUnit}
                    headline={formData.headline}
                    acUnitName={formData.acUnitName}
                    details={formData.details}
                    price={formData.price}
                    showLogo={formData.showLogo}
                    showPhone={formData.showPhone}
                    logoUrl={horizontalLogo}
                    phoneImageUrl={phoneNumberImage}
                    onUndo={handleUndo}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    isSaving={isSaving}
                />
            </section>

            <AdCreatorSidebar
                step={step}
                onStepChange={setStep}
                templates={templates}
                acUnits={acUnits}
                selectedTemplateId={selectedTemplateId}
                selectedAcUnitId={selectedAcUnitId}
                formData={formData}
                onSelectTemplate={handleSelectTemplate}
                onSelectAcUnit={handleSelectAcUnit}
                onFormChange={handleFormChange}
                onFinish={handleFinish}
                isSaving={isSaving}
            />

            <AdHistory refreshKey={refreshKey} />
        </div>
    );
}

export default Ads;