import { put } from 'redux-saga/effects';
import { requestFirebaseNotificationPermission } from '../../firebase/firebase.utils';

import http from '../../http';
import * as actions from '../actions';

export function* signIn(action) {
  try {
    const token = yield requestFirebaseNotificationPermission();

    const userData = yield http
      .post('/users/provider', { ...action.payload, deviceToken: token })
      .then((res) => res.data);

    yield put(actions.signInSuccess(userData));
  } catch (error) {
    console.log(error);
  }
}
