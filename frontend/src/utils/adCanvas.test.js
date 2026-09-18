import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { renderAdToCanvas, canvasToBlob, downloadCanvasAsPng } from './adCanvas';

const { mockLayoutToPx, mockFormatAdPrice, mockParseDetailLines } = vi.hoisted(() => ({
    mockLayoutToPx: vi.fn(),
    mockFormatAdPrice: vi.fn(),
    mockParseDetailLines: vi.fn()
}));

vi.mock('./adLayout', () => ({
    AD_CANVAS_WIDTH: 1000,
    AD_CANVAS_HEIGHT: 600,
    AD_FONT_FAMILY: 'TestFont',
    DEFAULT_AD_LAYOUT: {},
    layoutToPx: mockLayoutToPx
}));

vi.mock('./adCategories', () => ({
    formatAdPrice: mockFormatAdPrice,
    parseDetailLines: mockParseDetailLines
}));

describe('adCanvas', () => {
    let ctx;
    let canvas;
    let originalImage;

    beforeEach(() => {
        vi.clearAllMocks();

        ctx = {
            drawImage: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            fillText: vi.fn(),
            measureText: vi.fn((text) => ({ width: text.length * 10 })),
            fillStyle: '',
            font: '',
            textAlign: '',
            textBaseline: ''
        };

        canvas = document.createElement('canvas');

        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);

        originalImage = globalThis.Image;

        globalThis.Image = class MockImage {
            constructor() {
                this.width = 200;
                this.height = 100;
                this.naturalWidth = 200;
                this.naturalHeight = 100;
                this.crossOrigin = '';
                this.onload = null;
                this.onerror = null;
            }

            set src(value) {
                this._src = value;

                Promise.resolve().then(() => {
                    if (value === 'bad-image') {
                        this.onerror?.();
                    } else {
                        this.onload?.();
                    }
                });
            }

            get src() {
                return this._src;
            }
        };

        mockLayoutToPx.mockReturnValue({
            logo: { x: 10, y: 10, width: 100, height: 50, scale: 0.5 },
            phone: { x: 150, y: 10, width: 100, height: 50 },
            headline: { x: 20, y: 100, maxWidth: 50, color: 'red', fontWeight: 700, fontSize: 30 },
            deviceType: { x: 20, y: 200, maxWidth: 50, color: 'blue', fontWeight: 600, fontSize: 20 },
            details: { x: 20, y: 300, maxWidth: 80, color: 'green', fontSize: 16, lineHeight: 1.2, bulletGap: 10 },
            price: { x: 20, y: 500, color: 'black', fontWeight: 700, fontSize: 24, prefix: '', suffix: ' Ft' },
            acUnit: { x: 400, y: 300, width: 200, height: 150 }
        });

        mockFormatAdPrice.mockImplementation(
            (price) => `FORMATTED-${price}`
        );

        mockParseDetailLines.mockReturnValue([]);

        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() }
        });

        vi.spyOn(HTMLCanvasElement.prototype, 'toBlob')
            .mockImplementation((callback, type) => {
                callback( new Blob(['image-data'], { type: type || 'image/png' }) );
            });

        globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
        globalThis.URL.revokeObjectURL = vi.fn();

        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    });

    afterEach(() => {
        globalThis.Image = originalImage;
        vi.restoreAllMocks();
    });

    describe('renderAdToCanvas', () => {
        it('creates a canvas and draws the background image', async () => {
            const result = await renderAdToCanvas({
                templateUrl: 'template.jpg',
                acUnitUrl: null,
                logoUrl: null,
                phoneImageUrl: null,
                headline: '',
                acUnitName: '',
                details: '',
                price: '',
                showLogo: false,
                showPhone: false
            });

            expect(result).toBeInstanceOf(HTMLCanvasElement);
            expect(result.width).toBe(1000);
            expect(result.height).toBe(600);

            expect(mockLayoutToPx).toHaveBeenCalledWith({}, 1000, 600 );

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
            expect(ctx.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 1000, 600 );
        });

        it('waits for document fonts when fonts.ready exists', async () => {
            const ready = Promise.resolve();

            Object.defineProperty(document, 'fonts', {
                configurable: true,
                value: { ready }
            });

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                showLogo: false,
                showPhone: false
            });

            expect(mockLayoutToPx).toHaveBeenCalled();
        });

        it('works when document.fonts is unavailable', async () => {
            Object.defineProperty(document, 'fonts', {
                configurable: true,
                value: undefined
            });

            await expect(
                renderAdToCanvas({
                    templateUrl: 'template.jpg',
                    showLogo: false,
                    showPhone: false
                })
            ).resolves.toBeInstanceOf(HTMLCanvasElement);
        });

        it('throws when the template image source is missing', async () => {
            await expect(
                renderAdToCanvas({
                    templateUrl: '',
                    showLogo: false,
                    showPhone: false
                })
            ).rejects.toThrow('Missing image source');
        });

        it('throws when an image fails to load', async () => {
            await expect(
                renderAdToCanvas({
                    templateUrl: 'bad-image',
                    showLogo: false,
                    showPhone: false
                })
            ).rejects.toThrow('Failed to load image: bad-image');
        });

        it('draws the logo when showLogo is true and logoUrl exists', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                logoUrl: 'logo.png',
                showLogo: true,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(2);

            expect(ctx.drawImage).toHaveBeenNthCalledWith(
                2, expect.any(Object), expect.any(Number),
                expect.any(Number), expect.any(Number), expect.any(Number) );
        });

        it('does not draw the logo when showLogo is false', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                logoUrl: 'logo.png',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('does not draw the logo when logoUrl is missing', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                logoUrl: null,
                showLogo: true,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('draws the phone image when showPhone is true and phoneImageUrl exists', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                phoneImageUrl: 'phone.png',
                showLogo: false,
                showPhone: true
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(2);
        });

        it('does not draw the phone image when showPhone is false', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                phoneImageUrl: 'phone.png',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('does not draw the phone image when phoneImageUrl is missing', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                phoneImageUrl: null,
                showLogo: false,
                showPhone: true
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('draws and wraps the headline', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                headline: 'Első szöveg második',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.save).toHaveBeenCalled();
            expect(ctx.restore).toHaveBeenCalled();

            expect(ctx.fillStyle).toBe('red');
            expect(ctx.font).toBe('700 30px TestFont');
            expect(ctx.textAlign).toBe('left');
            expect(ctx.textBaseline).toBe('top');

            expect(ctx.fillText).toHaveBeenCalled();

            const calls = ctx.fillText.mock.calls;

            expect(calls[0][0]).toBe('Első');
            expect(calls[1][0]).toBe('szöveg');
        });

        it('does not add an empty line when the text contains only whitespace', async () => {
            await renderAdToCanvas({ templateUrl: 'template.jpg', headline: '   ', showLogo: false, showPhone: false });
            expect(ctx.fillText).not.toHaveBeenCalled();
        });

        it('does not draw the headline when it is empty', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                headline: '',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.fillText).not.toHaveBeenCalled();
        });

        it('draws and wraps the AC unit name', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                acUnitName: 'Daikin Sensira',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.fillStyle).toBe('blue');
            expect(ctx.font).toBe('600 20px TestFont');

            expect(ctx.fillText).toHaveBeenCalled();
        });

        it('does not draw the AC unit name when it is empty', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                acUnitName: '',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.fillText).not.toHaveBeenCalled();
        });

        it('draws detail lines when parseDetailLines returns data', async () => {
            mockParseDetailLines.mockReturnValue([
                'Ingyenes felmérés',
                'Gyors telepítés'
            ]);

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                details: 'details',
                showLogo: false,
                showPhone: false
            });

            expect(mockParseDetailLines).toHaveBeenCalledWith( 'details' );

            expect(ctx.fillStyle).toBe('green');
            expect(ctx.font).toBe('400 16px TestFont');

            expect(ctx.fillText).toHaveBeenNthCalledWith( 1, '•', 20, 300 );

            expect(ctx.fillText).toHaveBeenNthCalledWith( 2, 'Ingyenes', 20, expect.any(Number) );

            expect(ctx.fillText).toHaveBeenNthCalledWith( 3, 'felmérés', 20, expect.any(Number) );

            expect(ctx.fillText).toHaveBeenNthCalledWith( 4, '• Gyors', 20, expect.any(Number) );

            expect(ctx.fillText).toHaveBeenNthCalledWith( 5, 'telepítés', 20, expect.any(Number) );
        });

        it('does not draw details when no detail lines exist', async () => {
            mockParseDetailLines.mockReturnValue([]);

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                details: '',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.fillText).not.toHaveBeenCalled();
        });

        it('draws the price when price is provided', async () => {
            mockFormatAdPrice.mockReturnValue('299 990');

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                price: 299990,
                showLogo: false,
                showPhone: false
            });

            expect(mockFormatAdPrice).toHaveBeenCalledWith(299990);

            expect(ctx.fillStyle).toBe('black');
            expect(ctx.font).toBe('700 24px TestFont');

            expect(ctx.fillText).toHaveBeenCalledWith( '299 990 Ft', 20, 500 );
        });

        it('draws the price when price is zero', async () => {
            mockFormatAdPrice.mockReturnValue('0');

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                price: 0,
                showLogo: false,
                showPhone: false
            });

            expect(mockFormatAdPrice).toHaveBeenCalledWith(0);
            expect(ctx.fillText).toHaveBeenCalledWith( '0 Ft', 20, 500 );
        });

        it.each([ null, undefined, '' ])('does not draw the price when price is %s', async (price) => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                price,
                showLogo: false,
                showPhone: false
            });

            expect(mockFormatAdPrice).not.toHaveBeenCalled();
            expect(ctx.fillText).not.toHaveBeenCalled();
        });

        it('draws the AC unit image when acUnitUrl exists', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                acUnitUrl: 'ac-unit.png',
                showLogo: false,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(2);
        });

        it('does not draw the AC unit image when acUnitUrl is missing', async () => {
            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                acUnitUrl: null,
                showLogo: false,
                showPhone: false
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('draws all optional elements together', async () => {
            mockParseDetailLines.mockReturnValue([ 'Ingyenes felmérés' ]);

            mockFormatAdPrice.mockReturnValue('299 990');

            await renderAdToCanvas({
                templateUrl: 'template.jpg',
                logoUrl: 'logo.png',
                phoneImageUrl: 'phone.png',
                acUnitUrl: 'ac-unit.png',
                headline: 'Prémium klíma',
                acUnitName: 'Daikin Sensira',
                details: 'Ingyenes felmérés',
                price: 299990,
                showLogo: true,
                showPhone: true
            });

            expect(ctx.drawImage).toHaveBeenCalledTimes(4);
            expect(ctx.fillText).toHaveBeenCalled();
        });
    });

    describe('canvasToBlob', () => {
        it('returns the blob when canvas.toBlob succeeds', async () => {
            const blob = new Blob(['test']);

            canvas.toBlob = vi.fn((callback, type) => {
                callback(blob);
                expect(type).toBe('image/png');
            });

            const result = await canvasToBlob(canvas);

            expect(result).toBe(blob);
            expect(canvas.toBlob).toHaveBeenCalledWith( expect.any(Function), 'image/png' );
        });

        it('uses a custom blob type', async () => {
            const blob = new Blob(['test']);

            canvas.toBlob = vi.fn((callback, type) => {
                expect(type).toBe('image/jpeg');
                callback(blob);
            });

            const result = await canvasToBlob( canvas, 'image/jpeg' );

            expect(result).toBe(blob);
        });

        it('rejects when canvas.toBlob returns null', async () => {
            canvas.toBlob = vi.fn((callback) => {
                callback(null);
            });

            await expect(canvasToBlob(canvas)).rejects.toThrow('Nem sikerült PNG-t generálni.');
        });
    });

    describe('downloadCanvasAsPng', () => {
        it('downloads the canvas as PNG', async () => {
            const blob = new Blob(['image']);

            canvas.toBlob = vi.fn((callback) => { callback(blob);} );

            const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

            await downloadCanvasAsPng(canvas, 'teszt-hirdetes.png');

            expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(blob);

            expect(clickSpy).toHaveBeenCalled();

            expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
        });

        it('uses the default filename', async () => {
            const blob = new Blob(['image']);

            canvas.toBlob = vi.fn((callback) => { callback(blob); });

            const anchorClick = vi.spyOn( HTMLAnchorElement.prototype, 'click'
            ).mockImplementation(function () {
                expect(this.download).toBe('hirdetes.png');
            });

            await downloadCanvasAsPng(canvas);

            expect(anchorClick).toHaveBeenCalled();
        });

        it('propagates the canvasToBlob error', async () => {
            canvas.toBlob = vi.fn((callback) => { callback(null); });

            await expect(downloadCanvasAsPng(canvas, 'teszt.png')).rejects.toThrow('Nem sikerült PNG-t generálni.');

            expect(globalThis.URL.createObjectURL).not.toHaveBeenCalled();
        });
    });
});