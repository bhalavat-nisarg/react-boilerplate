const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const addDevMiddlewares = require('../addDevMiddlewares');

jest.mock('webpack', () => jest.fn());
jest.mock('webpack-dev-middleware', () => jest.fn());
jest.mock('webpack-hot-middleware', () => jest.fn());

describe('development middleware', () => {
  let app;
  let compiler;
  let readFile;

  beforeEach(() => {
    app = { use: jest.fn(), get: jest.fn() };
    compiler = { outputPath: path.resolve('build') };
    readFile = jest.fn();
    webpack.mockReturnValue(compiler);
    webpackDevMiddleware.mockReturnValue({
      context: { outputFileSystem: { readFile } },
    });
    webpackHotMiddleware.mockReturnValue('hot middleware');
  });

  it('uses supported middleware options and keeps HMR attached', () => {
    const config = { output: { publicPath: '/' } };
    addDevMiddlewares(app, config);

    expect(webpackDevMiddleware).toHaveBeenCalledWith(compiler, {
      publicPath: '/',
      stats: 'errors-only',
    });
    expect(webpackHotMiddleware).toHaveBeenCalledWith(compiler);
    expect(app.use).toHaveBeenLastCalledWith('hot middleware');
  });

  it('serves the SPA shell from the middleware 7 output filesystem', () => {
    addDevMiddlewares(app, { output: { publicPath: '/' } });
    const handler = app.get.mock.calls[0][1];
    const res = { send: jest.fn(), sendStatus: jest.fn() };
    readFile.mockImplementation((filename, callback) =>
      callback(null, Buffer.from('<html>app</html>')),
    );

    handler({}, res);

    expect(readFile).toHaveBeenCalledWith(
      path.join(compiler.outputPath, 'index.html'),
      expect.any(Function),
    );
    expect(res.send).toHaveBeenCalledWith('<html>app</html>');
  });

  it('returns 404 if the compiled SPA shell cannot be read', () => {
    addDevMiddlewares(app, { output: { publicPath: '/' } });
    const handler = app.get.mock.calls[0][1];
    const res = { send: jest.fn(), sendStatus: jest.fn() };
    readFile.mockImplementation((filename, callback) =>
      callback(new Error('missing shell')),
    );

    handler({}, res);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });
});
