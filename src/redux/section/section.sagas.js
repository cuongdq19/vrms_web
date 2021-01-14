import { call, all, put, takeLatest } from 'redux-saga/effects';

import SectionActionTypes from './section.types';
import { fetchSectionsSuccess, fetchSectionsFailure } from './section.actions';
import http from '../../http';

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

export function* onFetchSectionsStart() {
  yield takeLatest(SectionActionTypes.FETCH_SECTIONS_START, fetchSections);
}

export default function* sectionSagas() {
  yield all([call(onFetchSectionsStart)]);
}
