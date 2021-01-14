import { call, all, put, takeLatest } from 'redux-saga/effects';

import ManufacturerActionTypes from './manufacturer.types';
import {
  fetchManufacturersFailure,
  fetchManufacturersSuccess,
} from './manufacturer.actions';
import http from '../../http';

export function* fetchManufacturers() {
  try {
    const data = yield http.get('/manufacturers').then(({ data }) => data);
    yield put(fetchManufacturersSuccess(data));
  } catch (error) {
    yield put(fetchManufacturersFailure(error));
  }
}

export function* onFetchManufacturersStart() {
  yield takeLatest(
    ManufacturerActionTypes.FETCH_MANUFACTURERS_START,
    fetchManufacturers
  );
}

export default function* manufacturerSagas() {
  yield all([call(onFetchManufacturersStart)]);
}
