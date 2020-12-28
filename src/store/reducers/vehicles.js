import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  manufacturers: [],
  models: [],
  loading: false,
};

const fetchData = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchManufacturersSuccess = (state, action) => {
  return updateObject(state, { loading: false, manufacturers: action.payload });
};

const fetchModelsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    models: action.payload,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MODELS:
    case actionTypes.FETCH_MANUFACTURERS:
      return fetchData(state, action);
    case actionTypes.FETCH_MANUFACTURERS_SUCCESS:
      return fetchManufacturersSuccess(state, action);
    case actionTypes.FETCH_MODELS_SUCCESS:
      return fetchModelsSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
