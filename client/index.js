import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import createAppStore from '../src/store/configureStore';
import Routes from '../src/routes';

const preloadedState = global.window && global.window.__PRELOADED_STATE__;
global.window && delete global.window.__PRELOADED_STATE__;

const store = createAppStore(preloadedState);

const renderMethod = module.hot ? render : hydrate;

renderMethod(
  <Provider store={store}>
    <Router>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
