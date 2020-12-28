import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  parts: [],
  sections: [],
  loading: false,
};

const fetchParts = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchPartsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    parts: action.payload,
  });
};

const fetchPartSectionsWithCategories = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchPartSectionsWithCategoriesSuccess = (state, action) => {
  return updateObject(state, { loading: false, sections: action.payload });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PARTS:
      return fetchParts(state, action);
    case actionTypes.FETCH_PARTS_SUCCESS:
      return fetchPartsSuccess(state, action);
    case actionTypes.FETCH_PART_SECTIONS_WITH_CATEGORIES:
      return fetchPartSectionsWithCategories(state, action);
    case actionTypes.FETCH_PART_SECTIONS_WITH_CATEGORIES_SUCCESS:
      return fetchPartSectionsWithCategoriesSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
