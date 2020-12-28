import { put } from 'redux-saga/effects';

import * as actions from '../actions';

export function* initUpdateRequest(action) {
  try {
    yield put(actions.fetchServiceTypes());
  } catch (error) {
    console.log(error);
  }
}
