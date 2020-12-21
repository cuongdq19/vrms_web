import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { signIn } from './auth';

function* watchAuth() {
  yield all([takeEvery(actionTypes.SIGN_IN, signIn)]);
}

export default function* watchAll() {
  yield all([watchAuth()]);
}
