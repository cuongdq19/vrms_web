import { all, put } from 'redux-saga/effects';
import http from '../../http';
import * as actions from '../actions';

export function* fetchServiceTypes(action) {
  try {
    const serviceTypesData = yield http
      .get('/service-types')
      .then(({ data }) => data);
    yield put(actions.fetchServiceTypesSuccess(serviceTypesData));
  } catch (error) {
    console.log(error);
  }
}

export function* initModifyService(action) {
  try {
    yield all([
      put(actions.fetchManufacturers()),
      put(actions.fetchModels()),
      put(actions.fetchServiceTypes()),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* initModifyServiceWithParts(action) {
  try {
    yield all([
      put(actions.fetchManufacturers()),
      put(actions.fetchModels()),
      put(actions.fetchServiceTypes()),
      put(actions.fetchPartSectionsWithCategories()),
      put(actions.fetchParts()),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* initUpdateService(action) {
  const { typeDetail } = action.payload;
  try {
    yield all([
      put(actions.fetchManufacturers()),
      put(actions.fetchModels()),
      put(actions.fetchServiceTypes()),
      put(actions.fetchServiceSections(typeDetail.typeId)),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* initUpdateServiceWithParts(action) {
  const { typeDetail } = action.payload;
  try {
    yield all([
      put(actions.fetchManufacturers()),
      put(actions.fetchModels()),
      put(actions.fetchServiceTypes()),
      put(actions.fetchServiceSections(typeDetail.typeId)),
      put(actions.fetchPartSectionsWithCategories()),
      put(actions.fetchParts()),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export function* fetchServiceSections(action) {
  try {
    const sectionsData = yield http
      .post(`/service-type-details`, [action.typeId])
      .then(({ data }) => data);
    yield put(actions.fetchServiceSectionsSuccess(sectionsData));
  } catch (error) {
    console.log(error);
  }
}
