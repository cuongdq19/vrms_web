import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils';

const initialState = {
  packages: [],
  loading: false,
};

const fetchServicePackages = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchServicePackagesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    packages: action.packagesData,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SERVICE_PACKAGES:
      return fetchServicePackages(state, action);
    case actionTypes.FETCH_SERVICE_PACKAGES_SUCCESS:
      return fetchServicePackagesSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
