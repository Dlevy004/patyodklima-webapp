export const AD_CANVAS_WIDTH = 1920;
export const AD_CANVAS_HEIGHT = Math.round(1920 * 9 / 17);
export const AD_ASPECT_RATIO = '17 / 9';
export const AD_FONT_FAMILY = 'Josefin Sans, sans-serif';

export const DEFAULT_AD_LAYOUT = {
    logo: { x: 0.18, y: 0.06, width: 0.22, height: 0.12 },
    phone: { x: 0.42, y: 0.06, width: 0.24, height: 0.12 },
    headline: { x: 0.05, y: 0.24, maxWidth: 0.45, fontSize: 0.091, color: '#c41e1e', fontWeight: '800' },
    deviceType: { x: 0.05, y: 0.39, maxWidth: 0.45, fontSize: 0.056, color: '#1a1a1a', fontWeight: '600' },
    details: { x: 0.05, y: 0.52, maxWidth: 0.38, fontSize: 0.041, lineHeight: 1.4, color: '#1a1a1a', bulletGap: 0.028 },
    price: { x: 0.10, y: 0.84, fontSize: 0.082, color: '#c41e1e', fontWeight: '800', prefix: 'Bruttó: ', suffix: ' Ft' },
    acUnit: { x: 0.48, y: 0.20, width: 0.48, height: 0.70, scale: 1.1 },
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
            scale: layout.acUnit.scale ?? 1,
        },
    };
}