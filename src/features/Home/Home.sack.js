import { put, takeLatest } from 'redux-saga/effects';

export const initialState = {
  error: '',
  initialized: false,
};

export const homeSelector = state => state.home;

export const home = (state = initialState, { type }) => {
  switch (type) {
    case 'INIT_APP_SUCCEED':
      return {
        ...state,
        initialized: true,
      };

    default:
      return state;
  }
};

export const initApp = () => ({ type: 'INIT_APP' });
export const initAppSucceed = message => ({
  type: 'INIT_APP_SUCCEED',
  message,
});

export function* initAppSaga() {
  try {
    yield put(initAppSucceed('init successful'));
  } catch (e) {
    console.error('failed');
  }
}

export function* watchInitAppSaga() {
  yield takeLatest('INIT_APP', initAppSaga);
}
