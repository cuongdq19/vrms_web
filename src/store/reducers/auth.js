import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils';

const initialState = {
  userData: null,
  loading: false,
};

const signIn = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const signInSuccess = (state, action) => {
  return updateObject(state, { loading: false, userData: action.userData });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
      return signIn(state, action);
    case actionTypes.SIGN_IN_SUCCESS:
      return signInSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
