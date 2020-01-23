import express from 'express';
import axios from 'axios';
import fs from 'fs';
import util from 'util';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import Routes from '../../src/routes';
import config from '../../client/webpack.config';
import createAppStore from '../../src/store/configureStore';

const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);

const readFile = util.promisify(fs.readFile);

const getProductionAssets = async () => {
  let assetsByChunkName;

  try {
    const data = await readFile('./client/dist/stats.json');

    assetsByChunkName = JSON.parse(data).assetsByChunkName;
  } catch (error) {
    throw new Error(error);
  }

  return {
    data: {
      assetsByChunkName,
      publicPath: config.output.publicPath,
    },
  };
};

const router = express.Router();

router.get('*', async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const { data } = isProduction
    ? await getProductionAssets()
    : await axios.get(process.env.BUNDLER_URL);
  const { assetsByChunkName, publicPath } = data;

  const css = new Set();
  const insertCss = (...styles) =>
    styles.forEach(style => css.add(style._getCss()));
  const store = createAppStore();

  const html = renderToString(
    <Provider store={store}>
      <Router>
        <StyleContext.Provider value={{ insertCss }}>
          <Routes />
        </StyleContext.Provider>
      </Router>
    </Provider>,
  );

  const preloadedState = store.getState();

  const theHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>server side beatch</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
            // WARNING: See the following for security issues around embedding JSON in HTML:
            // https://redux.js.org/recipes/server-rendering/#security-considerations
            window.__PRELOADED_STATE__ = ${JSON.stringify(
              preloadedState,
            ).replace(/</g, '\\u003c')}
          </script>
          ${normalizeAssets(assetsByChunkName ? assetsByChunkName.client : [])
            .filter(filePath => filePath.endsWith('.js'))
            .map(filePath => `<script src="${publicPath}${filePath}"></script>`)
            .join('\n')}
      </body>
    </html>
  `;

  res.send(theHtml);
});

export default router;
