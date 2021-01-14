import { all, call, put, takeLatest } from 'redux-saga/effects';

import ModelActionTypes from './model.types';
import { fetchModelsFailure, fetchModelsSuccess } from './model.actions';
import http from '../../http';

export function* fetchModels() {
  try {
    const data = yield http.get('/models').then(({ data }) => data);
    yield put(fetchModelsSuccess(data));
  } catch (error) {
    yield put(fetchModelsFailure(error));
  }
}

export function* onFetchModelsStart() {
  yield takeLatest(ModelActionTypes.FETCH_MODELS_START, fetchModels);
}

export default function* modelSagas() {
  yield all([call(onFetchModelsStart)]);
}
