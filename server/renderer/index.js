import React from 'react';
import express from 'express';
import axios from 'axios';
import { all } from 'redux-saga/effects';
import fs from 'fs';
import util from 'util';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import createAppStore from '../../src/store/configureStore';
import config from '../../client/webpack.config';
import HTML from '../../src/components/HTML';
import { routesArray } from '../../src/routes';

const readFile = util.promisify(fs.readFile);

export const waitAll = sagas =>
  function* genTasks() {
    yield all(
      sagas.map(([saga]) => {
        return saga();
        // return fork(action, ...params);
      }),
    );
  };

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
  const store = createAppStore();

  const matchingRoute = routesArray.find(route => matchPath(req.path, route));

  if (matchingRoute) {
    await store.runSaga(waitAll(matchingRoute.component.preload())).toPromise();

    const preloadedState = store.getState();

    const { data } = isProduction
      ? await getProductionAssets()
      : await axios.get(process.env.BUNDLER_URL);
    const { assetsByChunkName, publicPath } = data;

    const html = renderToString(
      <HTML
        publicPath={publicPath}
        assetsByChunkName={assetsByChunkName}
        preloadedState={preloadedState}
        store={store}
        type="server"
      />,
    );

    res.send(`<!DOCTYPE html>\n${html}`);
    store.close();
  } else {
    res.status(404).send('Not found');
  }
});

export default router;
