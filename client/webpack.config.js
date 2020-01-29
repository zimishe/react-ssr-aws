const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const PUBLIC_PATH = '/dist/';

const { parsed: envKeys = {} } = dotenv.config();

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV,
  bail: process.env.NODE_ENV === 'production',
  entry: {
    client: [
      process.env.NODE_ENV === 'development' &&
        'webpack-hot-middleware/client?reload=true',
      './client',
    ].filter(Boolean),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: PUBLIC_PATH,
    filename: '[name].bundle.js',
  },
  watch: process.env.NODE_ENV === 'development',
  plugins: [].concat(
    [
      new webpack.DefinePlugin({
        'process.env': {
          SERVER: false,
          ...Object.keys(envKeys).reduce(
            (destination, key) =>
              Object.assign(destination, {
                [key]: JSON.stringify(envKeys[key]),
              }),
            {},
          ),
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
    process.env.NODE_ENV === 'development'
      ? [new webpack.HotModuleReplacementPlugin()]
      : [],
    process.env.NODE_ENV === 'production'
      ? [
          new StatsWriterPlugin(),
          new MiniCssExtractPlugin({
            filename: '[name]-[chunkhash].css',
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
            },
          },
          'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
};
