import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import StyleContext from 'isomorphic-style-loader/StyleContext';
import createAppStore from './store/configureStore';
import Routes from './routes';

// const insertCss = (...styles) => {
//   const removeCss = styles.map(style =>
//     style._insertCss ? style._insertCss() : null,
//   );
//   return () => removeCss.forEach(dispose => dispose());
// };

const preloadedState = global.window && global.window.__PRELOADED_STATE__;
global.window && delete global.window.__PRELOADED_STATE__;

const store = createAppStore(preloadedState);

const renderMethod = module.hot ? render : hydrate;

renderMethod(
  <Provider store={store}>
    <Router>
      {/* <StyleContext.Provider value={{ insertCss }}> */}
      <Routes />
      {/* </StyleContext.Provider> */}
    </Router>
  </Provider>,
  document.getElementById('root'),
);
