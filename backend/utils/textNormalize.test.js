const { normalizeText } = require('./textNormalize');


describe('normalizeText', () => {
    it('should return null when the value is only whitespace', () => {
        expect(normalizeText('   ')).toBeNull();
    });
});