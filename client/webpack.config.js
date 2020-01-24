const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
require('dotenv').config();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const PUBLIC_PATH = '/dist/';

module.exports = {
  watch: process.env.NODE_ENV === 'development',
  plugins: [].concat(
    [
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
  target: 'web',
  mode: process.env.NODE_ENV,
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
