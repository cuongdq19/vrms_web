import * as actionTypes from './actionTypes';

export const signIn = (username, password) => {
  return {
    type: actionTypes.SIGN_IN,
    payload: { username, password },
  };
};

export const signInSuccess = (userData) => {
  return {
    type: actionTypes.SIGN_IN_SUCCESS,
    userData,
  };
};

export const signOut = () => {
  return {
    type: actionTypes.SIGN_OUT,
  };
};
