const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
require('dotenv').config();

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const PUBLIC_PATH = '/dist/';

module.exports = {
  watch: true,
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    process.env.NODE_ENV === 'development' &&
      new webpack.HotModuleReplacementPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),
  ],
  target: 'web',
  mode: process.env.NODE_ENV,
  entry: {
    client: [
      process.env.NODE_ENV === 'development' &&
        'webpack-hot-middleware/client?reload=true',
      './client',
    ],
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
              // plugins: ['css-modules-transform'],
            },
          },
          'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          // 'isomorphic-style-loader',
          'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     hmr: true,
          //     publicPath: PUBLIC_PATH,
          //   },
          // },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
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
