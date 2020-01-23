const express = require('express');
const compression = require('compression');

const webpack = require('webpack');
const wdm = require('webpack-dev-middleware');
const whm = require('webpack-hot-middleware');
const config = require('../webpack.config');

const finalConfig = config[0];
const {
  output: { publicPath },
  stats,
} = finalConfig;

const compiler = webpack(finalConfig);
const app = express();

app.use(compression());
app.use(
  wdm(compiler, {
    publicPath,
    stats,
    serverSideRender: true,
  }),
);
app.use(whm(compiler));

app.get('/', async (req, res) => {
  const { assetsByChunkName } = res.locals.webpackStats.toJson();

  res.status(200).send({
    assetsByChunkName,
    publicPath,
  });
});

const port = process.env.BUNDLER_PORT;
app.listen(port, function listenHandler() {
  console.info(`Running on ${port}...`);
});
