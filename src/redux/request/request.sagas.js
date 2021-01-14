import { put, all, call, takeLatest, select } from 'redux-saga/effects';
import StateMachine from 'javascript-state-machine';

import RequestActionTypes from './request.types';
import {
  fetchRequestsFailure,
  fetchRequestsSuccess,
  checkInRequestsSuccess,
  checkInRequestsFailure,
  fetchAvailableTechniciansSuccess,
  fetchAvailableTechniciansFailure,
  confirmRequestSuccess,
  confirmRequestFailure,
  completeRequestSuccess,
  completeRequestFailure,
  checkoutRequestSuccess,
  checkoutRequestFailure,
} from './request.actions';
import http from '../../http';
import { requestStateMachineConfig } from '../../utils/constants';
import { message } from 'antd';

export function* fetchRequests() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/requests/providers/${providerId}`)
      .then(({ data }) =>
        data.map(({ user, ...rest }) => {
          const { fullName, phoneNumber, ...userProps } = user;
          return { fullName, phoneNumber, ...userProps, ...rest };
        })
      );
    data.forEach((req) => {
      StateMachine.apply(req, {
        ...requestStateMachineConfig,
        init: req.status,
      });
    });
    yield put(fetchRequestsSuccess(data));
  } catch (error) {
    yield put(fetchRequestsFailure(error));
  }
}

export function* checkInRequest({ payload: { requestId, technicianId } }) {
  try {
    yield http
      .post(`/requests/checkin/${requestId}/technicians/${technicianId}`)
      .then(({ data }) => data);
    yield put(checkInRequestsSuccess());
    message.success('Check-in success.');
  } catch (error) {
    yield put(checkInRequestsFailure(error));
    message.error('Check-in failed.');
  }
}

export function* fetchAvailableTechnicians({ payload }) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/providers/${providerId}/timestamp/${payload}`)
      .then(({ data }) => data);
    yield put(fetchAvailableTechniciansSuccess(data));
  } catch (error) {
    yield put(fetchAvailableTechniciansFailure(error));
  }
}

export function* confirmRequest({ payload }) {
  try {
    yield http.get(`/requests/confirm/${payload}`).then(({ data }) => data);
    yield put(confirmRequestSuccess());
    message.success('Confirm success.');
  } catch (error) {
    yield put(confirmRequestFailure(error));
    message.error('Confirm failed.');
  }
}

export function* completeRequest({ payload }) {
  try {
    yield http.get(`/requests/done/${payload}`).then(({ data }) => data);
    yield put(completeRequestSuccess());
    message.success('Successfully.');
  } catch (error) {
    yield put(completeRequestFailure(error));
    message.error('Failed.');
  }
}

export function* checkoutRequest({ payload }) {
  try {
    yield http.get(`/requests/checkout/${payload}`).then(({ data }) => data);
    yield put(checkoutRequestSuccess());
    message.success('Successfully.');
  } catch (error) {
    yield put(checkoutRequestFailure(error));
    message.error('Failed.');
  }
}

export function* onFetchRequests() {
  yield takeLatest(RequestActionTypes.FETCH_REQUESTS_START, fetchRequests);
  yield takeLatest(RequestActionTypes.CHECK_IN_REQUEST_SUCCESS, fetchRequests);
  yield takeLatest(RequestActionTypes.CONFIRM_REQUEST_SUCCESS, fetchRequests);
  yield takeLatest(RequestActionTypes.COMPLETE_REQUEST_SUCCESS, fetchRequests);
  yield takeLatest(RequestActionTypes.CHECKOUT_REQUEST_SUCCESS, fetchRequests);
}

export function* onCheckInRequest() {
  yield takeLatest(RequestActionTypes.CHECK_IN_REQUEST_START, checkInRequest);
}

export function* onFetchAvailableTechnicians() {
  yield takeLatest(
    RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_START,
    fetchAvailableTechnicians
  );
}

export function* onConfirmRequest() {
  yield takeLatest(RequestActionTypes.CONFIRM_REQUEST_START, confirmRequest);
}

export function* onCompleteRequest() {
  yield takeLatest(RequestActionTypes.COMPLETE_REQUEST_START, completeRequest);
}

export function* onCheckoutRequest() {
  yield takeLatest(RequestActionTypes.CHECKOUT_REQUEST_START, checkoutRequest);
}

export default function* requestSagas() {
  yield all([
    call(onFetchRequests),
    call(onCheckInRequest),
    call(onFetchAvailableTechnicians),
    call(onConfirmRequest),
    call(onCompleteRequest),
    call(onCheckoutRequest),
  ]);
}
