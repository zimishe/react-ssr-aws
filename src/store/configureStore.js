import 'regenerator-runtime/runtime';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import sagas from '../sagas';
import reducers from '../reducers';

const sagaMiddleware = createSagaMiddleware();

const createAppStore = (preloadedState = {}) => {
  const store = createStore(
    reducers,
    preloadedState,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(sagas);
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  return store;
};

export default createAppStore;
