import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import createAppStore from './store/configureStore';
import App from './App';

const preloadedState = global.window.__PRELOADED_STATE__;
delete global.window.__PRELOADED_STATE__;

const store = createAppStore(preloadedState);

const renderMethod = module.hot ? render : hydrate;

renderMethod(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
