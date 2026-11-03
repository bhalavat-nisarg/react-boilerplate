const { createHash } = require('crypto');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sharp = require('sharp');

const fingerprint = data =>
  createHash('sha256')
    .update(data)
    .digest('hex')
    .slice(0, 20);

class PwaManifestPlugin {
  constructor({ icons, ios, inject, ...manifest }) {
    this.icons = icons;
    this.ios = ios;
    this.inject = inject;
    this.manifest = {
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      ...manifest,
    };
  }

  async resources(compilation, RawSource) {
    const icons = await Promise.all(
      this.icons.flatMap(icon =>
        icon.sizes.map(async size => {
          compilation.fileDependencies.add(icon.src);
          const image = await sharp(icon.src)
            .resize(size, size, { fit: 'fill' })
            .png()
            .toBuffer();
          const filename = `icon_${size}x${size}.${fingerprint(image)}.png`;
          compilation.emitAsset(filename, new RawSource(image));
          return {
            src: `/${filename}`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            ios: icon.ios,
          };
        }),
      ),
    );
    const manifest = JSON.stringify(
      {
        ...this.manifest,
        icons: icons.map(({ ios, ...icon }) => icon),
      },
      null,
      2,
    );
    const filename = `manifest.${fingerprint(manifest)}.json`;
    compilation.emitAsset(filename, new RawSource(manifest));
    return { filename, icons };
  }

  apply(compiler) {
    const name = 'PwaManifestPlugin';
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap(name, compilation => {
      let resources;
      compilation.hooks.processAssets.tapPromise(
        { name, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        async () => {
          resources = await this.resources(compilation, sources.RawSource);
        },
      );
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(name, data => {
        if (!this.inject) return data;
        const tag = (tagName, attributes) => ({
          tagName,
          voidTag: true,
          attributes,
          meta: { plugin: name },
        });
        data.assetTags.meta.push(
          tag('link', { rel: 'manifest', href: `/${resources.filename}` }),
          tag('meta', {
            name: 'theme-color',
            content: this.manifest.theme_color,
          }),
        );
        if (this.ios) {
          data.assetTags.meta.push(
            ...[
              ['apple-mobile-web-app-title', this.manifest.name],
              ['apple-mobile-web-app-capable', 'yes'],
              ['apple-mobile-web-app-status-bar-style', 'default'],
            ].map(([metaName, content]) =>
              tag('meta', { name: metaName, content }),
            ),
            ...resources.icons
              .filter(icon => icon.ios)
              .map(icon =>
                tag('link', {
                  rel: 'apple-touch-icon',
                  sizes: icon.sizes,
                  href: icon.src,
                }),
              ),
          );
        }
        return data;
      });
    });
  }
}

module.exports = PwaManifestPlugin;
