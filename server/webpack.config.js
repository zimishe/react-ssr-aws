require('dotenv').config();
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  target: 'node',
  watch: true,
  mode: process.env.NODE_ENV,
  entry: {
    server: './server/index.js',
  },
  node: {
    dns: 'mock',
    fs: 'empty',
    path: true,
    url: false,
    net: 'empty',
  },
  output: {
    path: path.join(__dirname, '/dist'),
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
              plugins: ['css-modules-transform'],
            },
          },
          'eslint-loader',
        ],
        // use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'isomorphic-style-loader',
          // 'style-loader',
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
              // modules: true,
            },
          },
        ],
      },
    ],
  },
  externals: { express: 'commonjs express' },
};
