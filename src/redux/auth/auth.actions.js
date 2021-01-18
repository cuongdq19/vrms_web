import AuthActionTypes from './auth.types';

export const signIn = (username, password) => {
  return {
    type: AuthActionTypes.SIGN_IN,
    payload: { username, password },
  };
};

export const signInSuccess = (userData) => {
  return {
    type: AuthActionTypes.SIGN_IN_SUCCESS,
    userData,
  };
};

export const signOut = () => {
  return {
    type: AuthActionTypes.SIGN_OUT,
  };
};
