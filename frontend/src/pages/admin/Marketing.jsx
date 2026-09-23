import { useCallback, useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import './Marketing.css';

import usePageTitle from '@/hooks/usePageTitle';
import useFetch from '@/hooks/useFetch';
import useMarketingForm from '@/hooks/useMarketingForm';
import { getAuthHeaders } from '@/utils/api';
import { renderMarketingToCanvas, downloadCanvasAsPng, canvasToBlob } from '@/utils/marketingCanvas';
import MarketingPreview from '@/components/admin/marketings/MarketingPreview';
import MarketingCreatorSidebar from '@/components/admin/marketings/MarketingCreatorSidebar';
import MarketingHistory from '@/components/admin/marketings/MarketingHistory';
import horizontalLogo from '@/assets/images/logo.avif';
import phoneNumberImage from '@/assets/images/phoneNumber.png';

const API_URL = import.meta.env.VITE_API_URL;
const TEMPLATES_URL = `${API_URL}/api/marketing-templates`;
const MARKETING_AC_UNITS_URL = `${API_URL}/api/marketing-ac-units`;
const MARKETINGS_URL = `${API_URL}/api/marketings`;

function Marketing() {
    usePageTitle('Hirdetések');

    const { data: templatesData } = useFetch(TEMPLATES_URL);
    const { data: acUnitsData } = useFetch(MARKETING_AC_UNITS_URL);

    const templates = templatesData ?? [];
    const acUnits = acUnitsData ?? [];

    const {
        formData, formErrors,
        handleInputChange, resetForm, validateForm,
    } = useMarketingForm();

    const [step, setStep] = useState('templates');
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [selectedAcUnitId, setSelectedAcUnitId] = useState(null);
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

    const buildCanvas = useCallback(async () => {
        if (!selectedTemplate?.background_image_url) {
            throw new Error('Válassz sablont a hirdetés elkészítéséhez.');
        }

        return renderMarketingToCanvas({
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
        resetForm();

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

        if (!validateForm()) {
            toast.error('Kérlek töltsd ki a hiányzó mezőket!');
            return;
        }

        setIsSaving(true);

        try {
            const canvas = await buildCanvas();
            const blob = await canvasToBlob(canvas);

            const payload = new FormData();
            payload.append('image', blob, 'hirdetes.png');
            payload.append('templateId', selectedTemplateId);
            payload.append('headline', formData.headline);
            payload.append('acUnitName', formData.acUnitName);
            payload.append('details', formData.details);
            payload.append('fullPrice', String(formData.price));
            payload.append('showLogo', String(formData.showLogo));
            payload.append('showPhone', String(formData.showPhone));

            const response = await fetch(`${MARKETINGS_URL}/generate`, {
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
        <div className='marketing-page'>
            <section className='marketing-creator'>
                <MarketingPreview
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

            <MarketingCreatorSidebar
                step={step}
                onStepChange={setStep}
                templates={templates}
                acUnits={acUnits}
                selectedTemplateId={selectedTemplateId}
                selectedAcUnitId={selectedAcUnitId}
                formData={formData}
                formErrors={formErrors}
                onSelectTemplate={setSelectedTemplateId}
                onSelectAcUnit={setSelectedAcUnitId}
                onFormChange={handleInputChange}
                onFinish={handleFinish}
                isSaving={isSaving}
            />

            <MarketingHistory refreshKey={refreshKey} />
        </div>
    );
}

export default Marketing;