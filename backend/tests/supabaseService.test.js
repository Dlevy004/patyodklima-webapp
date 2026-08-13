const supabaseService = require('../services/supabaseService');
const supabase = require('../config/supabase');


jest.mock('../config/supabase', () => ({
    storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        remove: jest.fn()
    }
}));

jest.mock('sharp', () => {
    return jest.fn().mockImplementation(() => ({
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('optimized fake image data'))
    }));
});

describe('Supabase Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date('2026-08-12T00:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('uploadImage', () => {
        it('should successfully upload an image and return the public URL', async () => {
            // Arrange
            const mockFile = {
                originalname: 'teszt kep.jpg',
                buffer: Buffer.from('fake image data'),
                mimetype: 'image/jpeg'
            };

            const currentTime = Date.now();
            const expectedFileName = `${currentTime}-teszt_kep.webp`;

            const expectedUrl = `https://supabase.co/storage/v1/object/public/References/${expectedFileName}`;
            supabase.storage.upload.mockResolvedValue({ data: {}, error: null });
            supabase.storage.getPublicUrl.mockReturnValue({
                data: { publicUrl: expectedUrl }
            });

            // Act
            const result = await supabaseService.uploadImage(mockFile);

            // Assert
            expect(result).toBe(expectedUrl);
            expect(supabase.storage.from).toHaveBeenCalledWith('References');
            expect(supabase.storage.upload).toHaveBeenCalledWith(
                expectedFileName,
                Buffer.from('optimized fake image data'),
                { contentType: 'image/webp' }
            );
        });

        it('should throw an error if the upload fails', async () => {
            // Arrange
            const mockFile = { originalname: 'hiba.jpg', buffer: Buffer.from(''), mimetype: 'image/jpeg' };
            const errorMessage = 'Storage full';

            supabase.storage.upload.mockResolvedValue({
                data: null,
                error: { message: errorMessage }
            });

            // Act & Assert
            await expect(supabaseService.uploadImage(mockFile)).rejects.toThrow(`Supabase upload error: ${errorMessage}`);
        });
    });

    describe('deleteImage', () => {
        it('should successfully extract filename and delete the image', async () => {
            // Arrange
            const imageUrl = 'https://supabase.co/storage/v1/object/public/References/123-kep.jpg';
            supabase.storage.remove.mockResolvedValue({ error: null });

            // Act
            await supabaseService.deleteImage(imageUrl);

            // Assert
            expect(supabase.storage.from).toHaveBeenCalledWith('References');
            expect(supabase.storage.remove).toHaveBeenCalledWith(['123-kep.jpg']);
        });

        it('should log an error if deletion fails', async () => {
            // Arrange
            const imageUrl = 'https://supabase.co/.../hiba.jpg';
            const errorMessage = 'File not found';

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            supabase.storage.remove.mockResolvedValue({
                error: { message: errorMessage }
            });

            // Act
            await supabaseService.deleteImage(imageUrl);

            // Assert
            expect(consoleSpy).toHaveBeenCalledWith(`Supabase delete error: ${errorMessage}`);

            consoleSpy.mockRestore();
        });
    });
});