import {
    AD_CANVAS_WIDTH,
    AD_CANVAS_HEIGHT,
    AD_FONT_FAMILY,
    DEFAULT_AD_LAYOUT,
    layoutToPx,
} from './adLayout';
import { formatAdPrice, parseDetailLines } from './adCategories';

function loadImage(src) {
    return new Promise((resolve, reject) => {
        if (!src) {
            reject(new Error('Missing image source'));
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

function drawContainedImage(ctx, img, box) {
    const scale = Math.min(box.width / img.width, box.height / img.height) * (box.scale || 1);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const drawX = box.x + (box.width - drawWidth) / 2;
    const drawY = box.y + (box.height - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

export async function renderAdToCanvas({
    templateUrl,
    acUnitUrl,
    logoUrl,
    phoneImageUrl,
    headline,
    acUnitName,
    details,
    price,
    showLogo,
    showPhone,
    layout = DEFAULT_AD_LAYOUT,
}) {
    const canvas = document.createElement('canvas');
    canvas.width = AD_CANVAS_WIDTH;
    canvas.height = AD_CANVAS_HEIGHT;

    if (typeof document !== 'undefined' && document.fonts?.ready) {
        await document.fonts.ready;
    }

    const ctx = canvas.getContext('2d');
    const px = layoutToPx(layout, AD_CANVAS_WIDTH, AD_CANVAS_HEIGHT);

    const background = await loadImage(templateUrl);
    ctx.drawImage(background, 0, 0, AD_CANVAS_WIDTH, AD_CANVAS_HEIGHT);

    if (showLogo && logoUrl) {
        const logo = await loadImage(logoUrl);
        drawContainedImage(ctx, logo, px.logo);
    }

    if (showPhone && phoneImageUrl) {
        const phoneImage = await loadImage(phoneImageUrl);
        drawContainedImage(ctx, phoneImage, px.phone);
    }

    if (headline) {
        ctx.save();
        ctx.fillStyle = px.headline.color;
        ctx.font = `${px.headline.fontWeight} ${px.headline.fontSize}px ${AD_FONT_FAMILY}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        wrapText(ctx, headline, px.headline.maxWidth).forEach((line, index) => {
            ctx.fillText(line, px.headline.x, px.headline.y + index * px.headline.fontSize * 1.1);
        });
        ctx.restore();
    }

    if (acUnitName) {
        ctx.save();
        ctx.fillStyle = px.deviceType.color;
        ctx.font = `${px.deviceType.fontWeight} ${px.deviceType.fontSize}px ${AD_FONT_FAMILY}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        wrapText(ctx, acUnitName, px.deviceType.maxWidth).forEach((line, index) => {
            ctx.fillText(line, px.deviceType.x, px.deviceType.y + index * px.deviceType.fontSize * 1.15);
        });
        ctx.restore();
    }

    const detailLines = parseDetailLines(details);
    if (detailLines.length > 0) {
        ctx.save();
        ctx.fillStyle = px.details.color;
        ctx.font = `400 ${px.details.fontSize}px ${AD_FONT_FAMILY}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        let currentY = px.details.y;
        detailLines.forEach((line) => {
            const bullet = `• ${line}`;
            const wrapped = wrapText(ctx, bullet, px.details.maxWidth);
            wrapped.forEach((wrappedLine) => {
                ctx.fillText(wrappedLine, px.details.x, currentY);
                currentY += px.details.fontSize * px.details.lineHeight;
            });
            currentY += px.details.bulletGap * 0.35;
        });
        ctx.restore();
    }

    if (price !== '' && price !== null && price !== undefined) {
        ctx.save();
        ctx.fillStyle = px.price.color;
        ctx.font = `${px.price.fontWeight} ${px.price.fontSize}px ${AD_FONT_FAMILY}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${px.price.prefix}${formatAdPrice(price)}${px.price.suffix}`, px.price.x, px.price.y);
        ctx.restore();
    }

    if (acUnitUrl) {
        const acUnit = await loadImage(acUnitUrl);
        drawContainedImage(ctx, acUnit, px.acUnit);
    }

    return canvas;
}

export function canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Nem sikerült PNG-t generálni.'));
        }, type);
    });
}

export async function downloadCanvasAsPng(canvas, filename = 'hirdetes.png') {
    const blob = await canvasToBlob(canvas);
    const blobUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(blobUrl);
}