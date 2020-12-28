import { put } from 'redux-saga/effects';
import http from '../../http';
import * as actions from '../actions';

export function* fetchManufacturers(action) {
  try {
    const manufacturersData = yield http
      .get('/manufacturers')
      .then(({ data }) => data);
    yield put(actions.fetchManufacturersSuccess(manufacturersData));
  } catch (error) {
    console.log(error);
  }
}

export function* fetchModels(action) {
  try {
    const modelsData = yield http.get('/models').then(({ data }) => data);
    yield put(actions.fetchModelsSuccess(modelsData));
  } catch (error) {
    console.log(error);
  }
}
