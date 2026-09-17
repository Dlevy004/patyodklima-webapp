import PropTypes from 'prop-types';

import './AdPreview.css';

import ActionBtn from '@/components/admin/common/ActionBtn';
import { DEFAULT_AD_LAYOUT } from '@/utils/adLayout';
import { formatAdPrice, parseDetailLines } from '@/utils/adCategories';


function AdPreview({
    template, acUnit, headline, acUnitName,
    details, price, showLogo, showPhone,
    logoUrl, phoneImageUrl,
    onUndo, onDownload, onDelete, isSaving,
}) {
    const hasTemplate = Boolean(template?.background_image_url);
    const detailLines = parseDetailLines(details);
    const layout = DEFAULT_AD_LAYOUT;

    return (
        <div className='ad-preview-wrapper'>
            <div className={`ad-preview-stage ${hasTemplate ? 'has-template' : 'is-empty'}`}>
                {!hasTemplate ? (
                    <p className='ad-preview-placeholder'>Kérlek válassz egy sablont!</p>
                ) : (
                    <div
                        className='ad-preview-canvas'
                        style={{ backgroundImage: `url(${template.background_image_url})` }}
                    >
                        {showLogo && logoUrl && (
                            <img
                                src={logoUrl}
                                alt='Pátyod Klíma logó'
                                className='ad-layer ad-layer-logo'
                                style={{
                                    left: `${layout.logo.x * 700}%`,
                                    top: `${layout.logo.y * 100}%`,
                                    width: `${layout.logo.width * 100}%`,
                                    height: `${layout.logo.height * 100}%`,
                                }}
                            />
                        )}

                        {showPhone && phoneImageUrl && (
                            <img
                                src={phoneImageUrl}
                                alt='Telefonszám'
                                className='ad-layer ad-layer-phone'
                                style={{
                                    left: `${layout.phone.x * 70}%`,
                                    top: `${layout.phone.y * 130}%`,
                                    width: `${layout.phone.width * 100}%`,
                                    height: `${layout.phone.height * 100}%`,
                                }}
                            />
                        )}

                        {acUnit?.transparent_image_url && (
                            <img
                                src={acUnit.transparent_image_url}
                                alt={acUnit.model_name || 'Klíma készülék'}
                                className='ad-layer ad-layer-unit'
                                style={{
                                    left: `${layout.acUnit.x * 100}%`,
                                    top: `${layout.acUnit.y * 75}%`,
                                    width: `${layout.acUnit.width * 100}%`,
                                    height: `${layout.acUnit.height * 100}%`,
                                }}
                            />
                        )}

                        {headline && (
                            <p
                                className='ad-layer ad-layer-headline'
                                style={{
                                    left: `${layout.headline.x * 110}%`,
                                    top: `${layout.headline.y * 110}%`,
                                    maxWidth: `${layout.headline.maxWidth * 100}%`,
                                    color: layout.headline.color,
                                    fontSize: `${layout.headline.fontSize * 140}cqh`,
                                }}
                            >
                                {headline}
                            </p>
                        )}

                        {acUnitName && (
                            <p
                                className='ad-layer ad-layer-device'
                                style={{
                                    left: `${layout.deviceType.x * 110}%`,
                                    top: `${layout.deviceType.y * 115}%`,
                                    maxWidth: `${layout.deviceType.maxWidth * 100}%`,
                                    color: layout.deviceType.color,
                                    fontSize: `${layout.deviceType.fontSize * 200}cqh`,
                                }}
                            >
                                {acUnitName}
                            </p>
                        )}

                        {detailLines.length > 0 && (
                            <ul
                                className='ad-layer ad-layer-details'
                                style={{
                                    left: `${layout.details.x * 110}%`,
                                    top: `${layout.details.y * 125}%`,
                                    maxWidth: `${layout.details.maxWidth * 100}%`,
                                    color: layout.details.color,
                                    fontSize: `${layout.details.fontSize * 170}cqh`,
                                    lineHeight: layout.details.lineHeight,
                                }}
                            >
                                {detailLines.map((line) => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        )}

                        {price !== '' && price !== null && price !== undefined && (
                            <p
                                className='ad-layer ad-layer-price'
                                style={{
                                    left: `${layout.price.x * 250}%`,
                                    top: `${layout.price.y * 120}%`,
                                    color: layout.price.color,
                                    fontSize: `${layout.price.fontSize * 150}cqh`,
                                }}
                            >
                                {layout.price.prefix}{formatAdPrice(price)}{layout.price.suffix}
                            </p>
                        )}
                    </div>
                )}

                {hasTemplate && (
                    <div className='ad-preview-actions'>
                        <ActionBtn type='undo' onClick={onUndo} />
                        <ActionBtn type='download' onClick={onDownload} />
                        <ActionBtn type='delete' onClick={onDelete} />
                    </div>
                )}

                {isSaving && (
                    <div className='ad-preview-loading' aria-live='polite'>
                        <span className='ad-preview-spinner' aria-hidden='true'></span>
                    </div>
                )}
            </div>
        </div>
    );
}

AdPreview.propTypes = {
    template: PropTypes.shape({
        background_image_url: PropTypes.string,
    }),
    acUnit: PropTypes.shape({
        transparent_image_url: PropTypes.string,
        model_name: PropTypes.string,
    }),
    headline: PropTypes.string,
    acUnitName: PropTypes.string,
    details: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showLogo: PropTypes.bool,
    showPhone: PropTypes.bool,
    logoUrl: PropTypes.string,
    phoneImageUrl: PropTypes.string,
    onUndo: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
};

export default AdPreview;