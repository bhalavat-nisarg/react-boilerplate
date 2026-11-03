const imageLoader = require('image-webpack-loader');
const isSvg = require('is-svg');
const createBaseConfig = require('../../webpack/webpack.base.babel');

it('optimizes SVG with the migrated image and PNG quality options', async () => {
  const config = createBaseConfig({ mode: 'production', plugins: [] });
  const imageRule = config.module.rules.find(rule =>
    rule.test.test('image.png'),
  );
  const input = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><metadata>remove me</metadata><path d="M0 0h10v10H0z"/></svg>',
  );
  const output = await new Promise((resolve, reject) => {
    imageLoader.call(
      {
        version: 2,
        query: imageRule.use[1].options,
        cacheable: jest.fn(),
        async: () => (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      },
      input,
    );
  });

  expect(output.toString()).toContain('viewBox="0 0 10 10"');
  expect(output.toString()).not.toContain('<metadata>');
  expect(output.toString()).toContain('<path');
});

it('validates SVG with the patched XML parser and rejects malformed markup', () => {
  expect(isSvg('<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>')).toBe(
    true,
  );
  expect(isSvg('<svg><path></svg>')).toBe(false);
  expect(isSvg('<document/>')).toBe(false);
});
