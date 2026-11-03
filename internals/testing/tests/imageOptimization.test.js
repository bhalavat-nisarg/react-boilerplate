/** @jest-environment node */
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const sharp = require('sharp');
const createBaseConfig = require('../../webpack/webpack.base.babel');

const original = (filename, data) => ({
  filename,
  data,
  warnings: [],
  errors: [],
  info: {},
});

it('optimizes SVG while retaining its scalable viewBox', async () => {
  const input = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><metadata>remove me</metadata><path d="M0 0h10v10H0z"/></svg>',
  );
  const output = await ImageMinimizerPlugin.svgoMinify(
    original('image.svg', input),
  );
  expect(output.errors).toEqual([]);
  expect(output.data.toString()).toContain('viewBox="0 0 10 10"');
  expect(output.data.toString()).not.toContain('<metadata>');
  expect(output.data.toString()).toContain('<path');
});

it('reports malformed SVG rather than emitting a corrupt optimized asset', async () => {
  const input = original('image.svg', Buffer.from('<svg><path></svg>'));
  expect(await ImageMinimizerPlugin.svgoMinify(input)).toBeNull();
  expect(input.errors[0].message).toContain('image.svg');
});

it('compresses PNG without changing dimensions or transparency', async () => {
  const input = await sharp({
    create: {
      width: 32,
      height: 24,
      channels: 4,
      background: { r: 120, g: 40, b: 80, alpha: 0.5 },
    },
  })
    .png({ compressionLevel: 0 })
    .toBuffer();
  const config = createBaseConfig({ mode: 'production', plugins: [] });
  const optimizer = config.plugins.find(
    plugin => plugin instanceof ImageMinimizerPlugin,
  ).options.minimizer[0];
  const output = await optimizer.implementation(
    original('image.png', input),
    optimizer.options,
  );
  expect(output.errors).toEqual([]);
  expect(output.data.length).toBeLessThan(input.length);
  const metadata = await sharp(output.data).metadata();
  expect(metadata.width).toBe(32);
  expect(metadata.height).toBe(24);
  expect(metadata.hasAlpha).toBe(true);
});

it('preserves animated GIF frames and timing', async () => {
  const input = await sharp(
    Buffer.from([
      255,
      0,
      0,
      255,
      255,
      0,
      0,
      255,
      0,
      0,
      255,
      255,
      0,
      0,
      255,
      255,
    ]),
    { raw: { width: 2, height: 2, channels: 4, pageHeight: 1 } },
  )
    .gif({ loop: 0, delay: [100, 200] })
    .toBuffer();
  const output = await ImageMinimizerPlugin.sharpMinify(
    original('image.gif', input),
    { encodeOptions: { gif: {} } },
  );
  expect(output.errors).toEqual([]);
  const metadata = await sharp(output.data, { animated: true }).metadata();
  expect(metadata.pages).toBe(2);
  expect(metadata.pageHeight).toBe(1);
  expect(metadata.delay).toEqual([100, 200]);
});
