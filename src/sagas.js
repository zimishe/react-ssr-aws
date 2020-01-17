import { all } from 'redux-saga/effects';
import { watchInitAppSaga } from './features/Home/Home.sack';

export default function* sacks() {
  yield all([watchInitAppSaga()]);
}
