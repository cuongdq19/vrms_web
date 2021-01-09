import * as UserActionTypes from './user.types';

export const signIn = (username, password) => {
  return {
    type: UserActionTypes.SIGN_IN,
    payload: { username, password },
  };
};

export const signInSuccess = (userData) => {
  return {
    type: UserActionTypes.SIGN_IN_SUCCESS,
    userData,
  };
};

export const signOut = () => {
  return {
    type: UserActionTypes.SIGN_OUT,
  };
};
