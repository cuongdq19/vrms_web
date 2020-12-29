import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { signIn } from './auth';
import { fetchParts, fetchPartSectionsWithCategories } from './parts';
import { initUpdateRequest } from './requests';
import {
  fetchServicesByProviderAndType,
  fetchServiceSections,
  fetchServiceTypes,
  initModifyService,
  initModifyServiceWithParts,
  initUpdateService,
  initUpdateServiceWithParts,
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
    takeEvery(actionTypes.INIT_UPDATE_SERVICE, initUpdateService),
    takeEvery(
      actionTypes.INIT_UPDATE_SERVICE_WITH_PARTS,
      initUpdateServiceWithParts
    ),
    takeEvery(
      actionTypes.FETCH_SERVICES_BY_PROVIDER_AND_TYPE,
      fetchServicesByProviderAndType
    ),
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

function* watchRequests() {
  yield all([takeEvery(actionTypes.INIT_UPDATE_REQUEST, initUpdateRequest)]);
}

export default function* watchAll() {
  yield all([
    watchAuth(),
    watchVehicles(),
    watchServices(),
    watchParts(),
    watchRequests(),
  ]);
}
