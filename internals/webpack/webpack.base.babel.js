/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output,
  ), // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /favicon\.ico$/,
        type: 'asset/resource',
        generator: { filename: '[name][ext]' },
      },
      {
        test: /\.htaccess$/,
        type: 'asset/resource',
        generator: { filename: '.htaccess' },
      },
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
        generator: {
          dataUrl: content => svgToMiniDataURI(content.toString()),
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              list: [{ tag: 'img', attribute: 'src', type: 'src' }],
            },
          },
        },
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10000 } },
      },
    ],
  },
  plugins: options.plugins.concat([
    new ImageMinimizerPlugin({
      minimizer: [
        {
          implementation: ImageMinimizerPlugin.sharpMinify,
          filter: (source, filename) => /\.(png|gif)$/i.test(filename),
          options: {
            encodeOptions: {
              png: { quality: 90, palette: true, effort: 7 },
              gif: { interFrameMaxError: 0, interPaletteMaxError: 0 },
            },
          },
        },
        {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: { encodeOptions: { multipass: true } },
        },
      ],
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devtool: options.devtool,
  target: ['web', 'es5'], // Preserve the application's legacy browser runtime target
  performance: options.performance || {},
});
