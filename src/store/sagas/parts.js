import { put, select } from 'redux-saga/effects';
import http from '../../http';
import * as actions from '../actions';

export function* fetchParts(action) {
  try {
    const providerId = yield select((state) => {
      return state.auth.userData.providerId;
    });
    const partsData = yield http
      .get(`/parts/${providerId}`)
      .then(({ data }) => data);
    yield put(actions.fetchPartsSuccess(partsData));
  } catch (error) {
    console.log(error);
  }
}

export function* fetchPartSectionsWithCategories(action) {
  try {
    const sectionsData = yield http
      .get(`/service-type-details/sections/categories`)
      .then(({ data }) => data);
    yield put(actions.fetchPartSectionsWithCategoriesSuccess(sectionsData));
  } catch (error) {
    console.log(error);
  }
}
