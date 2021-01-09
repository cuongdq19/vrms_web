import { all, call, put, takeLatest } from 'redux-saga/effects';

import { requestFirebaseNotificationPermission } from '../../firebase/firebase.utils';
import http from '../../http';
import { signInSuccess } from './user.actions';
import UserActionTypes from './user.types';

function* signIn(action) {
  try {
    const token = yield requestFirebaseNotificationPermission();

    const userData = yield http
      .post('/users/provider', { ...action.payload, deviceToken: token })
      .then((res) => res.data);

    yield put(signInSuccess(userData));
  } catch (error) {
    console.log(error);
  }
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN, signIn);
}

export default function* userSagas() {
  yield all([call(onSignInStart)]);
}
