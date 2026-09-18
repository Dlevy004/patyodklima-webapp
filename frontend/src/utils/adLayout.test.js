import { describe, it, expect } from 'vitest';
import { AD_CANVAS_WIDTH, AD_CANVAS_HEIGHT, AD_ASPECT_RATIO, AD_FONT_FAMILY, DEFAULT_AD_LAYOUT, layoutToPx } from './adLayout';


describe('Layout constants', () => {
    it('contains the correct canvas and font values', () => {
        expect(AD_CANVAS_WIDTH).toBe(1920);
        expect(AD_CANVAS_HEIGHT).toBe(Math.round(1920 * 9 / 17));
        expect(AD_ASPECT_RATIO).toBe('17 / 9');
        expect(AD_FONT_FAMILY).toBe('Josefin Sans, sans-serif');
    });

    it('contains the default layout', () => {
        expect(DEFAULT_AD_LAYOUT).toEqual({
            logo: { x: 0.18, y: 0.06, width: 0.22, height: 0.12 },
            phone: { x: 0.42, y: 0.06, width: 0.24, height: 0.12 },
            headline: { x: 0.05, y: 0.24, maxWidth: 0.45, fontSize: 0.091, color: '#c41e1e', fontWeight: '800' },
            deviceType: { x: 0.05, y: 0.39, maxWidth: 0.45, fontSize: 0.056, color: '#1a1a1a', fontWeight: '600' },
            details: { x: 0.05, y: 0.52, maxWidth: 0.38, fontSize: 0.041, lineHeight: 1.4, color: '#1a1a1a', bulletGap: 0.028 },
            price: { x: 0.10, y: 0.84, fontSize: 0.082, color: '#c41e1e', fontWeight: '800', prefix: 'Bruttó: ', suffix: ' Ft' },
            acUnit: { x: 0.48, y: 0.20, width: 0.48, height: 0.70, scale: 1.1 },
        });
    });
});

describe('layoutToPx', () => {
    it('converts normalized layout values to pixels', () => {
        const result = layoutToPx(DEFAULT_AD_LAYOUT, 1000, 500);

        expect(result).toEqual({
            logo: { x: 180, y: 30, width: 220, height: 60 },
            phone: { x: 420, y: 30, width: 240, height: 60 },
            headline: { x: 50, y: 120, maxWidth: 450, fontSize: 46, color: '#c41e1e', fontWeight: '800' },
            deviceType: { x: 50, y: 195, maxWidth: 450, fontSize: 28, color: '#1a1a1a', fontWeight: '600' },
            details: { x: 50, y: 260, maxWidth: 380, fontSize: 21, lineHeight: 1.4, color: '#1a1a1a', bulletGap: 14 },
            price: { x: 100, y: 420, fontSize: 41, color: '#c41e1e', fontWeight: '800', prefix: 'Bruttó: ', suffix: ' Ft' },
            acUnit: { x: 480, y: 100, width: 480, height: 350, scale: 1.1 },
        });
    });

    it('uses scale 1 when scale is missing', () => {
        const layout = {
            ...DEFAULT_AD_LAYOUT,
            acUnit: { ...DEFAULT_AD_LAYOUT.acUnit, scale: undefined },
        };

        expect(layoutToPx(layout, 1000, 500).acUnit.scale).toBe(1);
    });
});