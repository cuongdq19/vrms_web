import { all, call, put, takeLatest } from 'redux-saga/effects';

import ModelActionTypes from './model.types';
import { fetchModelsFailure, fetchModelsSuccess } from './model.actions';
import { fetchManufacturers } from '../manufacturer/manufacturer.sagas';
import http from '../../http';

export function* fetchModels() {
  try {
    const data = yield http.get('/models').then(({ data }) => data);
    yield put(fetchModelsSuccess(data));
  } catch (error) {
    yield put(fetchModelsFailure(error));
  }
}

export function* fetchManufacturersAndModels() {
  yield call(fetchManufacturers);
  yield call(fetchModels);
}

export function* onFetchModelsStart() {
  yield takeLatest(ModelActionTypes.FETCH_MODELS_START, fetchModels);
}

export function* onFetchManufacturersAndModels() {
  yield takeLatest(
    ModelActionTypes.FETCH_MANUFACTURERS_AND_MODELS,
    fetchManufacturersAndModels
  );
}

export default function* modelSagas() {
  yield all([call(onFetchModelsStart), call(onFetchManufacturersAndModels)]);
}
