import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { signIn } from './auth';
import { fetchParts, fetchPartSectionsWithCategories } from './parts';
import {
  fetchServiceSections,
  fetchServiceTypes,
  initModifyService,
  initModifyServiceWithParts,
} from './services';
import { fetchManufacturers, fetchModels } from './vehicles';

function* watchAuth() {
  yield all([takeEvery(actionTypes.SIGN_IN, signIn)]);
}

function* watchVehicles() {
  yield all([
    takeEvery(actionTypes.FETCH_MANUFACTURERS, fetchManufacturers),
    takeEvery(actionTypes.FETCH_MODELS, fetchModels),
  ]);
}

function* watchServices() {
  yield all([
    takeEvery(actionTypes.FETCH_SERVICE_TYPES, fetchServiceTypes),
    takeEvery(actionTypes.INIT_MODIFY_SERVICE, initModifyService),
    takeEvery(
      actionTypes.INIT_MODIFY_SERVICE_WITH_PARTS,
      initModifyServiceWithParts
    ),
    takeEvery(actionTypes.FETCH_SERVICE_SECTIONS, fetchServiceSections),
  ]);
}

function* watchParts() {
  yield all([
    takeEvery(actionTypes.FETCH_PARTS, fetchParts),
    takeEvery(
      actionTypes.FETCH_PART_SECTIONS_WITH_CATEGORIES,
      fetchPartSectionsWithCategories
    ),
  ]);
}

export default function* watchAll() {
  yield all([watchAuth(), watchVehicles(), watchServices(), watchParts()]);
}
