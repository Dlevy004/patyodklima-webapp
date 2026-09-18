import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { ChevronUp } from 'lucide-react';

import './AdCreatorSidebar.css';

import InputField from '@/components/admin/common/InputField';
import Slider from '@/components/admin/common/Slider';
import {
    AD_CATEGORY_LABELS,
    AD_STEP_LABELS,
    groupByCategory,
    groupAcUnitsByBrand,
} from '@/utils/adCategories';

const SIDEBAR_STORAGE_KEY = 'isAdSidebarCollapsed';
const MOBILE_BREAKPOINT = 1024;


function getInitialCollapsedState() {
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    if (isMobile) return true;

    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
}


function AdCreatorSidebar({
    step,
    onStepChange,
    templates,
    acUnits,
    selectedTemplateId,
    selectedAcUnitId,
    formData,
    formErrors = {},
    onSelectTemplate,
    onSelectAcUnit,
    onFormChange,
    onFinish,
    isSaving,
}) {
    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);

    useEffect(() => {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed);
    }, [isCollapsed]);

    const templatesByCategory = groupByCategory(templates);
    const unitsByBrand = groupAcUnitsByBrand(acUnits);

    const goNext = () => {
        if (step === 'templates') {
            if (!selectedTemplateId) {
                toast.error('Előbb válassz egy sablont!');
                return;
            }
            onStepChange('devices');
            return;
        }

        if (step === 'devices') {
            if (!selectedAcUnitId) {
                toast.error('Előbb válassz egy készüléket!');
                return;
            }
            onStepChange('text');
        }
    };

    const goBack = () => {
        if (step === 'text') onStepChange('devices');
        else if (step === 'devices') onStepChange('templates');
    };

    const renderTemplates = () => (
        <div className='ad-sidebar-content'>
            {Object.entries(templatesByCategory).map(([category, items]) => (
                <section key={category} className='ad-sidebar-group'>
                    <h3>{AD_CATEGORY_LABELS[category] || category}</h3>
                    <ul className='ad-template-list'>
                        {items.map((template) => (
                            <li key={template.id}>
                                <button
                                    type='button'
                                    className={`ad-template-card ${selectedTemplateId === template.id ? 'is-selected' : ''}`.trim()}
                                    onClick={() => onSelectTemplate(template.id)}
                                >
                                    <img src={template.background_image_url} alt={template.name} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {templates.length === 0 && (
                <p className='ad-sidebar-empty'>Még nincsenek feltöltött sablonok.</p>
            )}
        </div>
    );

    const renderDevices = () => (
        <div className='ad-sidebar-content'>
            {Object.entries(unitsByBrand).map(([brand, items]) => (
                <section key={brand} className='ad-sidebar-group'>
                    <h3>{brand}</h3>
                    <ul className='ad-device-list'>
                        {items.map((unit) => (
                            <li key={unit.id}>
                                <button
                                    type='button'
                                    className={`ad-device-card ${selectedAcUnitId === unit.id ? 'is-selected' : ''}`.trim()}
                                    onClick={() => onSelectAcUnit(unit.id)}
                                >
                                    {unit.transparent_image_url ? (
                                        <img src={unit.transparent_image_url} alt={unit.model_name || brand} />
                                    ) : (
                                        <span className='ad-device-placeholder'>{unit.model_name || brand}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {acUnits.length === 0 && (
                <p className='ad-sidebar-empty'>Még nincsenek feltöltött készülékek.</p>
            )}
        </div>
    );

    const renderTextForm = () => (
        <div className='ad-sidebar-content ad-sidebar-form'>
            <div className='ad-form-col'>
                <InputField
                    label='Főcím'
                    type='text'
                    value={formData.headline}
                    onChange={(e) => onFormChange('headline', e.target.value)}
                    placeholder='Pl.: Nyári ajánlat'
                    required
                    error={formErrors.headline}
                />
                <InputField
                    label='Készülék típusa'
                    type='text'
                    value={formData.acUnitName}
                    onChange={(e) => onFormChange('acUnitName', e.target.value)}
                    placeholder='Pl.: ANDE'
                    required
                    error={formErrors.acUnitName}
                />
                <InputField
                    label='Részletek'
                    type='textarea'
                    value={formData.details}
                    onChange={(e) => onFormChange('details', e.target.value)}
                    placeholder={'Pl.:\nCseppvíz-fűtés\nWi-Fi vezérlés\nA+++ energiaosztály'}
                    required
                    error={formErrors.details}
                />
            </div>
            <div className='ad-form-col'>
                <InputField
                    label='Ár'
                    type='number'
                    value={formData.price}
                    onChange={(e) => onFormChange('price', e.target.value)}
                    required
                    error={formErrors.price}
                />

                <Slider
                    title='Logó'
                    condition={formData.showLogo ? '' : 'slide-right'}
                    button1ClassName={`ad-toggle-btn ${formData.showLogo ? 'active' : ''}`.trim()}
                    button1Title='Igen'
                    onButton1Click={() => onFormChange('showLogo', true)}
                    button2ClassName={`ad-toggle-btn ${!formData.showLogo ? 'active' : ''}`.trim()}
                    button2Title='Nem'
                    onButton2Click={() => onFormChange('showLogo', false)}
                />

                <Slider
                    title='Telefonszám'
                    condition={formData.showPhone ? '' : 'slide-right'}
                    button1ClassName={`ad-toggle-btn ${formData.showPhone ? 'active' : ''}`.trim()}
                    button1Title='Igen'
                    onButton1Click={() => onFormChange('showPhone', true)}
                    button2ClassName={`ad-toggle-btn ${!formData.showPhone ? 'active' : ''}`.trim()}
                    button2Title='Nem'
                    onButton2Click={() => onFormChange('showPhone', false)}
                />
            </div>
        </div>
    );

    return (
        <aside
            className={isCollapsed ? 'ad-sidebar ad-sidebar-collapsed' : 'ad-sidebar'}
            aria-label='Hirdetés szerkesztő panel'
        >
            <button
                type='button'
                className='ad-sidebar-toggle'
                onClick={() => setIsCollapsed((prev) => !prev)}
                aria-label={isCollapsed ? 'Panel kinyitása' : 'Panel összecsukása'}
                aria-expanded={!isCollapsed}
            >
                <ChevronUp aria-hidden='true' />
            </button>

            {isCollapsed ? (
                <p className='ad-sidebar-collapsed-label'>{AD_STEP_LABELS[step]}</p>
            ) : (
                <>
                    <h2 className='ad-sidebar-title'>{AD_STEP_LABELS[step]}</h2>

                    {step === 'templates' && renderTemplates()}
                    {step === 'devices' && renderDevices()}
                    {step === 'text' && renderTextForm()}

                    <div className='ad-sidebar-footer'>
                        {step !== 'templates' && (
                            <button type='button' className='ad-sidebar-btn ad-sidebar-btn-secondary' onClick={goBack}>
                                Vissza
                            </button>
                        )}

                        {step === 'templates' && (
                            <button
                                type='button'
                                className='ad-sidebar-btn ad-sidebar-btn-primary'
                                onClick={goNext}
                            >
                                Tovább
                            </button>
                        )}

                        {step === 'devices' && (
                            <button
                                type='button'
                                className='ad-sidebar-btn ad-sidebar-btn-primary'
                                onClick={goNext}
                            >
                                Tovább
                            </button>
                        )}

                        {step === 'text' && (
                            <button
                                type='button'
                                className='ad-sidebar-btn ad-sidebar-btn-primary'
                                onClick={onFinish}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Mentés…' : 'Kész'}
                            </button>
                        )}
                    </div>
                </>
            )}
        </aside>
    );
}

AdCreatorSidebar.propTypes = {
    step: PropTypes.oneOf(['templates', 'devices', 'text']).isRequired,
    onStepChange: PropTypes.func.isRequired,
    templates: PropTypes.array.isRequired,
    acUnits: PropTypes.array.isRequired,
    selectedTemplateId: PropTypes.string,
    selectedAcUnitId: PropTypes.string,
    formData: PropTypes.shape({
        headline: PropTypes.string,
        acUnitName: PropTypes.string,
        details: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        showLogo: PropTypes.bool,
        showPhone: PropTypes.bool,
    }).isRequired,
    onSelectTemplate: PropTypes.func.isRequired,
    onSelectAcUnit: PropTypes.func.isRequired,
    onFormChange: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
};

export default AdCreatorSidebar;