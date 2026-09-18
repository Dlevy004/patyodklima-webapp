import PropTypes from 'prop-types';

import './AdPreview.css';

import ActionBtn from '@/components/admin/common/ActionBtn';
import { DEFAULT_AD_LAYOUT } from '@/utils/adLayout';
import { formatAdPrice, parseDetailLines } from '@/utils/adCategories';

function layerBox(box) {
    return {
        left: `${box.x * 100}%`,
        top: `${box.y * 100}%`,
        width: box.width != null ? `${box.width * 100}%` : undefined,
        height: box.height != null ? `${box.height * 100}%` : undefined,
        maxWidth: box.maxWidth != null ? `${box.maxWidth * 100}%` : undefined,
        color: box.color,
        fontSize: box.fontSize != null ? `${box.fontSize * 100}cqh` : undefined,
        lineHeight: box.lineHeight,
        transform: box.scale ? `scale(${box.scale})` : undefined,
    };
}

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
                                style={layerBox(layout.logo)}
                            />
                        )}

                        {showPhone && phoneImageUrl && (
                            <img
                                src={phoneImageUrl}
                                alt='Telefonszám'
                                className='ad-layer ad-layer-phone'
                                style={layerBox(layout.phone)}
                            />
                        )}

                        {acUnit?.transparent_image_url && (
                            <img
                                src={acUnit.transparent_image_url}
                                alt={acUnit.model_name || 'Klíma készülék'}
                                className='ad-layer ad-layer-unit'
                                style={layerBox(layout.acUnit)}
                            />
                        )}

                        {headline && (
                            <p
                                className='ad-layer ad-layer-headline'
                                style={layerBox(layout.headline)}
                            >
                                {headline}
                            </p>
                        )}

                        {acUnitName && (
                            <p
                                className='ad-layer ad-layer-device'
                                style={layerBox(layout.deviceType)}
                            >
                                {acUnitName}
                            </p>
                        )}

                        {detailLines.length > 0 && (
                            <ul
                                className='ad-layer ad-layer-details'
                                style={layerBox(layout.details)}
                            >
                                {detailLines.map((line) => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        )}

                        {price !== '' && price !== null && price !== undefined && (
                            <p
                                className='ad-layer ad-layer-price'
                                style={layerBox(layout.price)}
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