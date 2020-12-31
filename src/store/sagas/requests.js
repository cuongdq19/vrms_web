import { all, put, select } from 'redux-saga/effects';
import * as StateMachine from 'javascript-state-machine';

import * as actions from '../actions';
import http from '../../http';
import { requestStateMachineConfig } from '../../utils/constants';

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
      .then(({ data }) => {
        data.forEach((req) => {
          StateMachine.apply(req, {
            ...requestStateMachineConfig,
            init: req.status,
          });
        });
        return data;
      });
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

export function* confirmRequest(action) {
  try {
    yield http
      .get(`/requests/confirm/${action.requestId}`)
      .then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}

export function* completeRequest(action) {
  try {
    yield http
      .get(`/requests/done/${action.requestId}`)
      .then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}

export function* checkoutRequest(action) {
  try {
    yield http
      .get(`/requests/checkout/${action.requestId}`)
      .then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}

export function* cancelRequest(action) {
  try {
    yield http.delete(`/requests/${action.requestId}`).then(({ data }) => data);
    yield put(actions.fetchRequests());
    action.callback();
  } catch (error) {
    console.log(error);
  }
}
