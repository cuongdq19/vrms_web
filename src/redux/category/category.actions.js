import CategoryActionTypes from './category.types';

export const fetchSectionsWithCategoriesStart = () => ({
  type: CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_START,
});

export const fetchSectionsWithCategoriesSuccess = (data) => ({
  type: CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_SUCCESS,
  payload: data,
});

export const fetchSectionsWithCategoriesFailure = (error) => ({
  type: CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_FAILURE,
  payload: error,
});
