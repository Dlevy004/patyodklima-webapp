export const AD_CANVAS_WIDTH = 1920;
export const AD_CANVAS_HEIGHT = 1080;
export const AD_ASPECT_RATIO = '17 / 9';
export const AD_FONT_FAMILY = 'Josefin Sans, sans-serif';

export const DEFAULT_AD_LAYOUT = {
    logo: { x: 0.04, y: 0.06, width: 0.22, height: 0.12 },
    phone: { x: 0.72, y: 0.06, width: 0.24, height: 0.12 },
    headline: { x: 0.04, y: 0.22, maxWidth: 0.45, fontSize: 0.065, color: '#c41e1e', fontWeight: '800' },
    deviceType: { x: 0.04, y: 0.34, maxWidth: 0.45, fontSize: 0.028, color: '#1a1a1a', fontWeight: '600' },
    details: { x: 0.04, y: 0.42, maxWidth: 0.38, fontSize: 0.024, lineHeight: 1.4, color: '#1a1a1a', bulletGap: 0.028 },
    price: { x: 0.04, y: 0.72, fontSize: 0.055, color: '#c41e1e', fontWeight: '800', prefix: 'Bruttó: ', suffix: ' Ft' },
    acUnit: { x: 0.48, y: 0.28, width: 0.48, height: 0.65 },
};

export function layoutToPx(layout, width, height) {
    const toPx = (value, dimension) => Math.round(value * dimension);

    return {
        logo: {
            x: toPx(layout.logo.x, width),
            y: toPx(layout.logo.y, height),
            width: toPx(layout.logo.width, width),
            height: toPx(layout.logo.height, height),
        },
        phone: {
            x: toPx(layout.phone.x, width),
            y: toPx(layout.phone.y, height),
            width: toPx(layout.phone.width, width),
            height: toPx(layout.phone.height, height),
        },
        headline: {
            x: toPx(layout.headline.x, width),
            y: toPx(layout.headline.y, height),
            maxWidth: toPx(layout.headline.maxWidth, width),
            fontSize: toPx(layout.headline.fontSize, height),
            color: layout.headline.color,
            fontWeight: layout.headline.fontWeight,
        },
        deviceType: {
            x: toPx(layout.deviceType.x, width),
            y: toPx(layout.deviceType.y, height),
            maxWidth: toPx(layout.deviceType.maxWidth, width),
            fontSize: toPx(layout.deviceType.fontSize, height),
            color: layout.deviceType.color,
            fontWeight: layout.deviceType.fontWeight,
        },
        details: {
            x: toPx(layout.details.x, width),
            y: toPx(layout.details.y, height),
            maxWidth: toPx(layout.details.maxWidth, width),
            fontSize: toPx(layout.details.fontSize, height),
            lineHeight: layout.details.lineHeight,
            color: layout.details.color,
            bulletGap: toPx(layout.details.bulletGap, height),
        },
        price: {
            x: toPx(layout.price.x, width),
            y: toPx(layout.price.y, height),
            fontSize: toPx(layout.price.fontSize, height),
            color: layout.price.color,
            fontWeight: layout.price.fontWeight,
            prefix: layout.price.prefix,
            suffix: layout.price.suffix,
        },
        acUnit: {
            x: toPx(layout.acUnit.x, width),
            y: toPx(layout.acUnit.y, height),
            width: toPx(layout.acUnit.width, width),
            height: toPx(layout.acUnit.height, height),
        },
    };
}