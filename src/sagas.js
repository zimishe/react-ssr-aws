import { all } from 'redux-saga/effects';
import { watchLoadHomeDataSaga } from './features/Home/Home.sack';

export default function* sagas() {
  yield all([watchLoadHomeDataSaga()]);
}
