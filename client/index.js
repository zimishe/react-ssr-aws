import React from 'react';
import { hydrate, render } from 'react-dom';
import HTML from '../src/components/HTML';
import createAppStore from '../src/store/configureStore';

const preloadedState = global.window && global.window.__PRELOADED_STATE__;
global.window && delete global.window.__PRELOADED_STATE__;

const store = createAppStore(preloadedState);

const renderMethod = module.hot ? render : hydrate;

renderMethod(
  <HTML type="client" store={store} />,
  document.getElementById('root'),
);
