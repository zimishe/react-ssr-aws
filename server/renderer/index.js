import React from 'react';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import util from 'util';
import { renderToString } from 'react-dom/server';
import createAppStore from '../../src/store/configureStore';
import config from '../../client/webpack.config';
import HTML from '../../src/components/HTML';

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

  const store = createAppStore();
  const preloadedState = store.getState();

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
});

export default router;
