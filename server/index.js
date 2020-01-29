import express from 'express';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import compression from 'compression';
import renderer from './renderer';

require('dotenv').config();

let middleware = renderer;

const app = express();

app.use(compression());

if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static('client/dist/'));
} else {
  app.get('/dist/*', proxy(process.env.BUNDLER_URL));
  app.get('/__webpack_hmr', ({ path: webpackPath }, res) =>
    res.redirect(301, `${process.env.BUNDLER_URL}${webpackPath}`),
  );
}

app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.get('*', (req, res, next) => middleware(req, res, next));

if (module.hot) {
  module.hot.accept('./renderer', () => {
    middleware = renderer;
  });
}

const port = process.env.SERVER_PORT;
app.listen(port, function listenHandler() {
  console.info(`Server listening on ${port}...`);
});
