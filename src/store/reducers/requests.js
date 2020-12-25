import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  updating: null,
};

const setUpdatingRequest = (state, action) => {
  return updateObject(state, {
    updating: action.request,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UPDATING_REQUEST:
      return setUpdatingRequest(state, action);
    default:
      return state;
  }
};

export default reducer;
