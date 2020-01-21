const HtmlWebPackPlugin = require('html-webpack-plugin');

const path = require('path');

const PUBLIC_PATH = '/dist/';

const PORT = 3000;

module.exports = [
  {
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
    target: 'web',
    mode: 'development', // TODO: add mode handling
    entry: {
      client: './src/index.js',
    },
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: PUBLIC_PATH,
      filename: '[name].bundle.js',
    },
    devServer: {
      publicPath: PUBLIC_PATH,
      contentBase: path.join(__dirname, 'dist/'),
      port: PORT,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          resolve: {
            extensions: ['.js', '.jsx'],
          },
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
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
  },
  {
    target: 'node',
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
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
        },
      ],
    },
    externals: { express: 'commonjs express' },
  },
];
