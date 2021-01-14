import { put, call, all, takeLatest } from 'redux-saga/effects';

import PartActionTypes from './part.types';
import { fetchPartsFailure, fetchPartsSuccess } from './part.actions';
import http from '../../http';

export function* fetchParts({ payload: { providerId } }) {
  try {
    const data = yield http
      .get(`/parts/${providerId}`)
      .then(({ data }) => data);
    yield put(fetchPartsSuccess(data));
  } catch (error) {
    yield put(fetchPartsFailure(error));
  }
}

export function* onFetchPartsStart() {
  yield takeLatest(PartActionTypes.FETCH_PARTS_START, fetchParts);
}

export default function* partSagas() {
  yield all([call(onFetchPartsStart)]);
}
