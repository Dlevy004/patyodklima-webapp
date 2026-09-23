describe('server.js', () => {
    let listenMock;

    beforeEach(() => {
        jest.resetModules();

        listenMock = jest.fn((port, cb) => {
            cb();
            return { close: jest.fn() };
        });

        jest.doMock('../app', () => ({
            listen: listenMock
        }));
    });

    afterEach(() => {
        jest.dontMock('../app');
    });

    it('should call app.listen with the configured port and log the start message', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        require('../server');

        expect(listenMock).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('The server started at'));

        consoleSpy.mockRestore();
    });
});