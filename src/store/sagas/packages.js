import { put, select } from 'redux-saga/effects';

import * as actions from '../actions';
import http from '../../http';

export function* fetchServicePackages(action) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const packagesData = yield http
      .get(`/service-packages/providers/${providerId}`)
      .then(({ data }) => data);
    yield put(actions.fetchServicePackagesSuccess(packagesData));
  } catch (error) {
    console.log(error);
  }
}
