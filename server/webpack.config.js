require('dotenv').config();
const StartServerPlugin = require('start-server-webpack-plugin');
const path = require('path');

module.exports = {
  target: 'node',
  watch: process.env.NODE_ENV === 'development',
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
  plugins: [].concat(
    process.env.NODE_ENV === 'development' && Boolean(process.env.SERVER_WATCH)
      ? [
          new StartServerPlugin({
            name: 'server.bundle.js',
            nodeArgs: ['--inspect'],
          }),
        ]
      : [],
  ),
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
    ],
  },
  externals: { express: 'commonjs express' },
};
