import express from 'express';
import compression from 'compression';
import router from './routes';

import config from '../webpack.config';

const webpack = require('webpack');
const wdm = require('webpack-dev-middleware');
const whm = require('webpack-hot-middleware');

const finalConfig = config[0];
const {
  output: { publicPath },
} = finalConfig;

const compiler = webpack(finalConfig);
const app = express();

app.use(compression());
app.use(
  wdm(compiler, {
    publicPath,
    serverSideRender: true,
  }),
);
app.use(whm(compiler));

app.use(express.static('../dist'));
app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, function listenHandler() {
  console.info(`Running on ${port}...`);
});
