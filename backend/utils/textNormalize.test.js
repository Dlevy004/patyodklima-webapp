const { normalizeText } = require('./textNormalize');


describe('normalizeText', () => {
    it('should return null when the value is only whitespace', () => {
        expect(normalizeText('   ')).toBeNull();
    });

    it('returns null when the value is falsy (null, undefined, empty string)', () => {
        expect(normalizeText(null)).toBeNull();
        expect(normalizeText(undefined)).toBeNull();
        expect(normalizeText('')).toBeNull();
    });
});