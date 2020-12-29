import { all, put } from 'redux-saga/effects';

import * as actions from '../actions';

export function* initUpdateRequest(action) {
  try {
    yield all([put(actions.fetchServiceTypes()), put(actions.fetchParts())]);
  } catch (error) {
    console.log(error);
  }
}
