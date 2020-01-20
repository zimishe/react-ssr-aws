const HtmlWebPackPlugin = require('html-webpack-plugin');

const path = require('path');

const PORT = 3000;

module.exports = [
  {
    entry: {
      client: './src/index.js',
    },
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: `http://localhost:${PORT}/`,
      filename: '[name].bundle.js',
    },
    devServer: {
      publicPath: `http://localhost:${PORT}/`,
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
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
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
      path: path.resolve(__dirname),
      filename: '[name].js',
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
        // {
        //   test: /\.css$/,
        //   use: [
        //     'style-loader',
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         importLoaders: 1,
        //         modules: true,
        //       },
        //     },
        //   ],
        // },
      ],
    },
    externals: ['express'],
  },
];
