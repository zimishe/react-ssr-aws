import { put, call, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import { SUCCEED } from '../../constants/actions';

export const initialState = {
  error: '',
  initialized: false,
  data: [],
};

export const LOAD_HOME_DATA = 'LOAD_HOME_DATA';
export const LOAD_HOME_DATA_SUCCEED = `${LOAD_HOME_DATA}_${SUCCEED}`;

export const homeSelector = state => state.home;

export const home = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_HOME_DATA_SUCCEED:
      return {
        ...state,
        initialized: true,
        data: payload.data,
      };

    default:
      return state;
  }
};

export const loadHomeData = () => ({ type: LOAD_HOME_DATA });
export const loadHomeDataSucceed = payload => ({
  type: LOAD_HOME_DATA_SUCCEED,
  payload,
});

export function* loadHomeDataSaga({ payload }) {
  try {
    const { data } = yield call(axios, {
      url: 'https://api.shutterstock.com/v2/images/categories',
      method: 'GET',
      auth: {
        username: process.env.SHUTTERSTOCK_KEY,
        password: process.env.SHUTTERSTOCK_SECRET,
      },
      params: { language: payload.language },
    });
    yield put(loadHomeDataSucceed(data));
  } catch (e) {
    console.error('failed');
  }
}

export function* watchLoadHomeDataSaga() {
  yield takeEvery(LOAD_HOME_DATA, loadHomeDataSaga);
}
