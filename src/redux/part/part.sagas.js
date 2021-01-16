import { put, call, all, takeLatest, select } from 'redux-saga/effects';

import PartActionTypes from './part.types';
import {
  fetchPartsFailure,
  fetchPartsSuccess,
  loadPartFormFailure,
  loadPartFormSuccess,
  createPartSuccess,
  createPartFailure,
  updatePartSuccess,
  updatePartFailure,
  removePartSuccess,
  removePartFailure,
  fetchSectionsSuccess,
  fetchSectionsFailure,
} from './part.actions';
import { fetchSectionsWithCategories } from '../category/category.sagas';
import { fetchManufacturersAndModels } from '../model/model.sagas';
import http from '../../http';
import { message } from 'antd';

export function* fetchParts() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/parts/${providerId}`)
      .then(({ data }) => data);
    yield put(fetchPartsSuccess(data));
  } catch (error) {
    yield put(fetchPartsFailure(error));
  }
}

export function* loadPartForm() {
  try {
    yield call(fetchSectionsWithCategories);
    yield call(fetchManufacturersAndModels);
    yield put(loadPartFormSuccess());
  } catch (error) {
    yield put(loadPartFormFailure(error));
  }
}

export function* createPart({ payload }) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const formData = new FormData();
    formData.append('providerId', providerId);
    Object.keys(payload).forEach((key) => {
      switch (key) {
        case 'images':
          payload[key].forEach(({ originFileObj }) => {
            formData.append(key, originFileObj);
          });
          break;
        case 'modelIds':
          payload[key].forEach((item) => formData.append(key, item));
          break;
        case 'categoryId':
          formData.append(key, payload[key][1]);
          break;
        default:
          formData.append(key, payload[key]);
          break;
      }
    });

    yield http.post('/parts', formData).then(({ data }) => data);
    message.success('Create successfully.');
    yield put(createPartSuccess());
  } catch (error) {
    yield put(createPartFailure(error));
  }
}

export function* updatePart({ payload }) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const {
      categoryId: [, categoryId],
      description,
      modelIds,
      id,
      monthsPerMaintenance,
      name,
      price,
      warrantyDuration,
    } = payload;
    const body = {
      categoryId,
      description,
      modelIds,
      monthsPerMaintenance,
      name,
      providerId,
      price,
      warrantyDuration,
    };
    yield http.post(`/parts/${id}`, body).then(({ data }) => data);
    message.success('Update successfully.');
    yield put(updatePartSuccess());
  } catch (error) {
    yield put(updatePartFailure());
  }
}

export function* removePart({ payload }) {
  try {
    yield http.delete(`/parts/${payload}`).then(({ data }) => data);
    yield put(removePartSuccess());
    message.info(
      'Any services and packages contains this part will be disabled. You can remove this part out of these services to continue using.'
    );
  } catch (error) {
    yield put(removePartFailure(error));
  }
}

export function* fetchSections() {
  try {
    const data = yield http
      .get('/service-type-details/sections/plain')
      .then(({ data }) => data);
    yield put(fetchSectionsSuccess(data));
  } catch (error) {
    yield put(fetchSectionsFailure(error));
  }
}

export function* onFetchParts() {
  yield takeLatest(PartActionTypes.FETCH_PARTS_START, fetchParts);
  yield takeLatest(PartActionTypes.UPDATE_PART_SUCCESS, fetchParts);
  yield takeLatest(PartActionTypes.CREATE_PART_SUCCESS, fetchParts);
  yield takeLatest(PartActionTypes.REMOVE_PART_SUCCESS, fetchParts);
}

export function* onLoadPartForm() {
  yield takeLatest(PartActionTypes.LOAD_PART_FORM_START, loadPartForm);
}

export function* onCreatePart() {
  yield takeLatest(PartActionTypes.CREATE_PART_START, createPart);
}

export function* onUpdatePart() {
  yield takeLatest(PartActionTypes.UPDATE_PART_START, updatePart);
}

export function* onRemovePart() {
  yield takeLatest(PartActionTypes.REMOVE_PART_START, removePart);
}

export function* onFetchSectionsStart() {
  yield takeLatest(PartActionTypes.FETCH_SECTIONS_START, fetchSections);
}

export default function* partSagas() {
  yield all([
    call(onFetchParts),
    call(onLoadPartForm),
    call(onCreatePart),
    call(onUpdatePart),
    call(onRemovePart),
    call(onFetchSectionsStart),
  ]);
}
