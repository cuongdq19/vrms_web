import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  types: [],
  sections: [],
  services: [],
  loading: false,
  initModify: false,
};

const fetchData = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchServiceTypesSuccess = (state, action) => {
  return updateObject(state, { loading: false, types: action.payload });
};

const fetchServiceSectionsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    sections: action.payload,
  });
};

const fetchServicesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    services: action.payload,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SERVICE_TYPES:
    case actionTypes.FETCH_SERVICE_SECTIONS:
      return fetchData(state, action);
    case actionTypes.FETCH_SERVICE_TYPES_SUCCESS:
      return fetchServiceTypesSuccess(state, action);
    case actionTypes.FETCH_SERVICE_SECTIONS_SUCCESS:
      return fetchServiceSectionsSuccess(state, action);
    case actionTypes.FETCH_SERVICES_SUCCESS:
      return fetchServicesSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
