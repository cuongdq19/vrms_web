import { put, all, call, takeLatest } from 'redux-saga/effects';

import CategoryActionTypes from './category.types';
import {
  fetchSectionsWithCategoriesSuccess,
  fetchSectionsWithCategoriesFailure,
} from './category.actions';
import http from '../../http';

export function* fetchSectionsWithCategories() {
  try {
    const data = yield http
      .get('/service-type-details/sections/categories')
      .then(({ data }) => data);
    yield put(fetchSectionsWithCategoriesSuccess(data));
  } catch (error) {
    yield put(fetchSectionsWithCategoriesFailure(error));
  }
}

export function* onFetchSectionsWithCategories() {
  yield takeLatest(
    CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_START,
    fetchSectionsWithCategories
  );
}

export default function* categorySagas() {
  yield all([call(onFetchSectionsWithCategories)]);
}
