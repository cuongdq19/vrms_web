import { takeLatest, put, call, all, select } from 'redux-saga/effects';

import UserActionTypes from './user.types';
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  toggleUserActiveSuccess,
  toggleUserActiveFailure,
  createUserFailure,
  createUserSuccess,
  updateUserSuccess,
  updateUserFailure,
} from './user.actions';
import http from '../../http';

export function* fetchUsers() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/users/provider/${providerId}`)
      .then(({ data }) => data);
    yield put(fetchUsersSuccess(data));
  } catch (error) {
    yield put(fetchUsersFailure(error));
  }
}

export function* toggleUserActive({ payload }) {
  try {
    yield http.get(`/users/${payload}/provider`).then(({ data }) => data);
    yield put(toggleUserActiveSuccess());
  } catch (error) {
    yield put(toggleUserActiveFailure(error));
  }
}

export function* createUser({ payload }) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      switch (key) {
        case 'image':
          payload[key].forEach((obj) =>
            formData.append(key, obj.originFileObj)
          );
          break;
        default:
          formData.append(key, payload[key]);
      }
    });
    yield http
      .post(`/users/provider/${providerId}`, formData)
      .then(({ data }) => data);
    yield put(createUserSuccess());
  } catch (error) {
    yield put(createUserFailure(error));
  }
}

export function* updateUser({ payload }) {
  try {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      switch (key) {
        case 'image':
          payload[key].forEach((obj) =>
            formData.append(key, obj.originFileObj)
          );
          break;
        default:
          formData.append(key, payload[key]);
      }
    });
    yield http
      .post(`/users/${payload.id}/provider`, formData)
      .then(({ data }) => data);
    yield put(updateUserSuccess());
  } catch (error) {
    yield put(updateUserFailure(error));
  }
}

export function* onFetchUsers() {
  yield takeLatest(UserActionTypes.FETCH_USERS_START, fetchUsers);
  yield takeLatest(UserActionTypes.TOGGLE_USER_ACTIVE_SUCCESS, fetchUsers);
  yield takeLatest(UserActionTypes.CREATE_USER_SUCCESS, fetchUsers);
  yield takeLatest(UserActionTypes.UPDATE_USER_SUCCESS, fetchUsers);
}

export function* onToggleUserActive() {
  yield takeLatest(UserActionTypes.TOGGLE_USER_ACTIVE_START, toggleUserActive);
}

export function* onCreateUser() {
  yield takeLatest(UserActionTypes.CREATE_USER_START, createUser);
}

export function* onUpdateUser() {
  yield takeLatest(UserActionTypes.UPDATE_USER_START, updateUser);
}

export default function* userSagas() {
  yield all([
    call(onFetchUsers),
    call(onToggleUserActive),
    call(onCreateUser),
    call(onUpdateUser),
  ]);
}
