import { put } from 'redux-saga/effects';

import http from '../../http';
import * as actions from '../actions';

export function* signIn(action) {
  try {
    const userData = yield http
      .post('/users/provider', action.payload)
      .then((res) => res.data);
    yield put(actions.signInSuccess(userData));
  } catch (error) {
    console.log(error);
  }
}
