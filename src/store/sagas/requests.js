import { all, put, select } from 'redux-saga/effects';

import * as actions from '../actions';
import http from '../../http';

export function* initUpdateRequest(action) {
  try {
    yield all([put(actions.fetchServiceTypes()), put(actions.fetchParts())]);
  } catch (error) {
    console.log(error);
  }
}

export function* updateRequest(action) {
  try {
    yield http
      .post(
        `/requests/update/${action.updatedRequest.id}`,
        action.updatedRequest
      )
      .then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}

export function* fetchRequests(action) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/requests/providers/${providerId}`)
      .then(({ data }) => data);
    yield put(actions.fetchRequestsSuccess(data));
  } catch (error) {
    console.log(error);
  }
}

export function* checkInRequest(action) {
  try {
    yield http
      .post(
        `/requests/checkin/${action.requestId}/technicians/${action.userId}`
      )
      .then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}
