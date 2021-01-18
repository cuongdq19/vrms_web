import AuthActionTypes from './auth.types';
import { updateObject } from '../../utils';

const INITIAL_STATE = {
  userData: null,
  loading: false,
  updating: false,
  error: null,
};

const signIn = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const signInSuccess = (state, action) => {
  return updateObject(state, { loading: false, userData: action.userData });
};

const signOut = (state, action) => {
  return updateObject(state, {
    loading: false,
    userData: null,
  });
};

const updateProfileStart = (state, action) => {
  return {
    ...state,
    updating: true,
    error: null,
  };
};

const updateProfileSuccess = (state, action) => {
  return {
    ...state,
    updating: false,
    userData: action.payload,
  };
};

const updateProfileFailure = (state, action) => {
  return {
    ...state,
    updating: false,
    error: action.payload,
  };
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthActionTypes.SIGN_IN:
      return signIn(state, action);
    case AuthActionTypes.SIGN_IN_SUCCESS:
      return signInSuccess(state, action);
    case AuthActionTypes.SIGN_OUT:
      return signOut(state, action);
    case AuthActionTypes.UPDATE_PROFILE_START:
      return updateProfileStart(state, action);
    case AuthActionTypes.UPDATE_PROFILE_SUCCESS:
      return updateProfileSuccess(state, action);
    case AuthActionTypes.UPDATE_PROFILE_FAILURE:
      return updateProfileFailure(state, action);
    default:
      return state;
  }
};

export default authReducer;
