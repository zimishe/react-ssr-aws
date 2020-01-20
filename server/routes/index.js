import express from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import App from '../../src/App';
import createAppStore from '../../src/store/configureStore';

const router = express.Router();

router.get('/', async (req, res) => {
  const store = createAppStore();

  const html = renderToString(
    <Provider store={store}>
      <Router>
        <App />
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
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c',
          )}
        </script>
        <script src="./dist/client.bundle.js"></script>
    </body>
  </html>
`;

  res.send(theHtml);
});

export default router;
