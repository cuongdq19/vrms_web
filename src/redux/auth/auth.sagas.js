import { message } from 'antd';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { requestFirebaseNotificationPermission } from '../../firebase/firebase.utils';
import http from '../../http';
import {
  signInSuccess,
  signInFailure,
  updateProfileFailure,
  updateProfileSuccess,
} from './auth.actions';
import UserActionTypes from './auth.types';

function* signIn(action) {
  try {
    const token = yield requestFirebaseNotificationPermission();

    const userData = yield http
      .post('/users/provider', { ...action.payload, deviceToken: token })
      .then((res) => res.data);

    yield put(
      signInSuccess({ username: action.payload.username, ...userData })
    );
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* updateProfileAsync({ payload }) {
  try {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });
    const data = yield http
      .post(`/users/${payload.id}/provider`, formData)
      .then(({ data }) => data);
    yield put(updateProfileSuccess(data));
    message.success('Update profile success.');
  } catch (error) {
    yield put(updateProfileFailure(error));
  }
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN, signIn);
}

export function* onUpdateProfileStart() {
  yield takeLatest(UserActionTypes.UPDATE_PROFILE_START, updateProfileAsync);
}
export default function* authSagas() {
  yield all([call(onSignInStart), call(onUpdateProfileStart)]);
}
