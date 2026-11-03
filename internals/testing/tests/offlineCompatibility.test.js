/** @jest-environment node */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('../../webpack/offline-plugin');

it('compiles a working worker and opt-in AppCache fallback with the patched loader APIs', async () => {
  const output = path.resolve('internals/testing/webpack-output');
  const compiler = webpack({
    mode: 'production',
    entry: path.resolve('internals/testing/fixtures/offline-entry.js'),
    output: { path: output, filename: 'main.js', publicPath: '/' },
    target: ['web', 'es5'],
    plugins: [
      new HtmlWebpackPlugin({
        templateContent:
          '<!doctype html><html><head></head><body></body></html>',
      }),
      new OfflinePlugin({
        publicPath: '/',
        relativePaths: false,
        appShell: '/',
        AppCache: true,
        __tests: { appCacheEnabled: true },
      }),
    ],
  });
  try {
    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) =>
        error ? reject(error) : resolve(result),
      );
    });
    expect(stats.toJson({ all: false, errors: true }).errors).toEqual([]);
    const worker = fs.readFileSync(path.join(output, 'sw.js'), 'utf8');
    expect(worker).toContain('main.js');
    expect(worker).toContain('assets');
    const manifest = fs.readFileSync(
      path.join(output, 'appcache/manifest.appcache'),
      'utf8',
    );
    expect(manifest).toContain('CACHE MANIFEST');
    expect(manifest).toContain('/main.js');
    expect(manifest).toContain('NETWORK:\n*');
    const frame = fs.readFileSync(
      path.join(output, 'appcache/manifest.html'),
      'utf8',
    );
    expect(frame).toContain('manifest.appcache');
    const runtime = fs.readFileSync(path.join(output, 'main.js'), 'utf8');
    const register = jest.fn().mockResolvedValue({});
    vm.runInNewContext(runtime, {
      navigator: { serviceWorker: { register } },
      window: { location: { protocol: 'http:', hostname: 'localhost' } },
    });
    expect(register).toHaveBeenCalledWith('/sw.js', {});
    const iframe = { style: {} };
    const appendChild = jest.fn();
    vm.runInNewContext(runtime, {
      navigator: {},
      window: {
        applicationCache: {},
        location: { protocol: 'http:', hostname: 'example.test' },
      },
      document: {
        readyState: 'complete',
        createElement: () => iframe,
        body: { appendChild },
      },
      setTimeout: callback => callback(),
    });
    expect(iframe.src).toBe('/appcache/manifest.html');
    expect(appendChild).toHaveBeenCalledWith(iframe);
  } finally {
    await new Promise((resolve, reject) =>
      compiler.close(error => (error ? reject(error) : resolve())),
    );
    fs.rmSync(output, { recursive: true, force: true });
  }
}, 60000);
