import { all } from 'redux-saga/effects';
import { initAppSaga } from './features/Home/Home.sack';

export default function* sacks() {
  yield all([
    initAppSaga(),
  ]);
}
