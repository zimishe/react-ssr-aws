const StartServerPlugin = require('start-server-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const dotenvPath = process.env.DOTENV_PATH
  ? path.resolve(process.cwd(), process.env.DOTENV_PATH)
  : path.resolve(process.cwd(), '.env');

const { parsed: envKeys = {} } = dotenv.config({ path: dotenvPath });

console.info(
  `Environment was read from '${path.relative(process.cwd(), dotenvPath)}'`,
);

module.exports = {
  target: 'node',
  watch: process.env.NODE_ENV === 'development',
  bail: process.env.NODE_ENV === 'production',
  mode: process.env.NODE_ENV,
  entry: {
    server: './server/index.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js',
  },
  plugins: [].concat(
    new webpack.DefinePlugin({
      'process.env': {
        SERVER: true,
        ...Object.keys(envKeys).reduce(
          (destination, key) =>
            Object.assign(destination, {
              [key]: JSON.stringify(envKeys[key]),
            }),
          {},
        ),
      },
    }),
    process.env.NODE_ENV === 'development' && Boolean(process.env.SERVER_WATCH)
      ? [
          new StartServerPlugin({
            name: 'server.bundle.js',
            nodeArgs: ['--inspect'],
          }),
        ]
      : [],
  ),
  optimization: {
    minimize: true,
    minimizer: [
      process.env.NODE_ENV === 'production' &&
        new TerserJSPlugin({
          parallel: true,
          sourceMap: true,
        }),
      process.env.NODE_ENV === 'production' && new OptimizeCSSAssetsPlugin(),
    ].filter(Boolean),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-react',
              ],
              plugins: ['css-modules-transform'],
            },
          },
          'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          publicPath: './dist/',
        },
      },
    ],
  },
  externals: { express: 'commonjs express' },
};
