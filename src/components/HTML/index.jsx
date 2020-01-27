import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import Routes from '../../routes';
import ServerHelmet from '../ServerHelmet';

const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);

const HTML = ({
  type,
  store,
  assetsByChunkName,
  publicPath,
  preloadedState,
}) => {
  const Router = type === 'server' ? StaticRouter : BrowserRouter;

  const htmlContent = (
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  );

  return type === 'server' ? (
    <html lang="en">
      <head>
        <ServerHelmet />
        <meta charSet="utf-8" />
        {normalizeAssets(assetsByChunkName ? assetsByChunkName.client : [])
          .filter(path => path.endsWith('.css'))
          .map(path => (
            <link
              charSet="UTF-8"
              href={`${publicPath}${path}`}
              key={path}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
            />
          ))}
      </head>
      <body>
        <div id="root">{htmlContent}</div>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__=${JSON.stringify(
              preloadedState,
            ).replace(/</g, '\\u003c')};`,
          }}
        />
        {normalizeAssets(assetsByChunkName ? assetsByChunkName.client : [])
          .filter(path => path.endsWith('.js'))
          .map(path => (
            <script key={path} src={`${publicPath}${path}`} />
          ))}
      </body>
    </html>
  ) : (
    htmlContent
  );
};

HTML.propTypes = {
  type: PropTypes.string,
  store: PropTypes.object,
  assetsByChunkName: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  publicPath: PropTypes.string,
  preloadedState: PropTypes.object,
};

export default HTML;
