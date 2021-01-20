import CategoryActionTypes from './category.types';

const INITIAL_STATE = {
  categories: [],
  isFetching: false,
  error: null,
};

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_START:
      return {
        ...state,
        isFetching: true,
      };
    case CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        categories: action.payload,
      };
    case CategoryActionTypes.FETCH_SECTIONS_WITH_CATEGORIES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default categoryReducer;
