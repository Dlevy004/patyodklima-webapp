import { describe, it, expect } from 'vitest';
import { AD_CATEGORY_LABELS, AD_STEP_LABELS, groupByCategory, groupAcUnitsByBrand, formatAdPrice, parseDetailLines } from './adCategories';

describe('AD_CATEGORY_LABELS', () => {
    it('contains the correct labels', () => {
        expect(AD_CATEGORY_LABELS).toEqual({
            summer_offer: 'Nyári ajánlatok',
            winter_offer: 'Téli ajánlatok',
            spring_offer: 'Tavaszi ajánlatok',
            autumn_offer: 'Őszi ajánlatok',
            on_sale_offer: 'Akciós ajánlatok',
        });
    });
});

describe('AD_STEP_LABELS', () => {
    it('contains the correct labels', () => {
        expect(AD_STEP_LABELS).toEqual({ templates: 'Sablonok', devices: 'Készülékek', text: 'Szöveg' });
    });
});

describe('groupByCategory', () => {
    it('groups items by category', () => {
        const items = [{ id: 1, category: 'summer_offer' }, { id: 2, category: 'winter_offer' }, { id: 3, category: 'summer_offer' }];
        expect(groupByCategory(items)).toEqual({
            summer_offer: [{ id: 1, category: 'summer_offer' }, { id: 3, category: 'summer_offer' }],
            winter_offer: [{ id: 2, category: 'winter_offer' }],
        });
    });

    it('groups items without a category under other', () => {
        const items = [{ id: 1, category: 'summer_offer' }, { id: 2 }, { id: 3, category: null }, { id: 4, category: '' }];
        expect(groupByCategory(items)).toEqual({
            summer_offer: [{ id: 1, category: 'summer_offer' }],
            other: [{ id: 2 }, { id: 3, category: null }, { id: 4, category: '' }],
        });
    });

    it('supports a custom category key', () => {
        const items = [{ id: 1, type: 'a' }, { id: 2, type: 'b' }, { id: 3, type: 'a' }];
        expect(groupByCategory(items, 'type')).toEqual({
            a: [{ id: 1, type: 'a' }, { id: 3, type: 'a' }],
            b: [{ id: 2, type: 'b' }],
        });
    });

    it('returns an empty object for an empty array', () => {
        expect(groupByCategory([])).toEqual({});
    });
});

describe('groupAcUnitsByBrand', () => {
    it('groups units by brand', () => {
        const units = [{ id: 1, brand: 'Daikin' }, { id: 2, brand: 'Gree' }, { id: 3, brand: 'Daikin' }];
        expect(groupAcUnitsByBrand(units)).toEqual({
            Daikin: [{ id: 1, brand: 'Daikin' }, { id: 3, brand: 'Daikin' }],
            Gree: [{ id: 2, brand: 'Gree' }],
        });
    });

    it('groups units without a brand under Egyéb', () => {
        const units = [{ id: 1, brand: 'Daikin' }, { id: 2 }, { id: 3, brand: null }, { id: 4, brand: '' }];
        expect(groupAcUnitsByBrand(units)).toEqual({
            Daikin: [{ id: 1, brand: 'Daikin' }],
            Egyéb: [{ id: 2 }, { id: 3, brand: null }, { id: 4, brand: '' }],
        });
    });

    it('returns an empty object for an empty array', () => {
        expect(groupAcUnitsByBrand([])).toEqual({});
    });
});

describe('formatAdPrice', () => {
    it('formats a number correctly', () => expect(formatAdPrice(1234567)).toBe('1 234 567'));
    it('formats a numeric string correctly', () => expect(formatAdPrice('1234567')).toBe('1 234 567'));
    it('returns an empty string for NaN', () => expect(formatAdPrice(NaN)).toBe(''));
    it('returns an empty string for an invalid value', () => expect(formatAdPrice('abc')).toBe(''));
    it('formats null as zero', () => expect(formatAdPrice(null)).toBe('0'));
});

describe('parseDetailLines', () => {
    it('splits text into lines and trims whitespace', () => expect(parseDetailLines('First line\nSecond line')).toEqual(['First line', 'Second line']));
    it('removes bullet characters', () => expect(parseDetailLines('- First\n• Second\n* Third')).toEqual(['First', 'Second', 'Third']));
    it('filters out empty lines', () => expect(parseDetailLines('First\n\nSecond\n   \nThird')).toEqual(['First', 'Second', 'Third']));
    it('returns an empty array for empty values', () => {
        expect(parseDetailLines('')).toEqual([]);
        expect(parseDetailLines(null)).toEqual([]);
        expect(parseDetailLines(undefined)).toEqual([]);
    });
});