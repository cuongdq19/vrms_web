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

export const signInFailure = (error) => {
  return {
    type: AuthActionTypes.SIGN_IN_FAILURE,
    payload: error,
  };
};

export const signOut = () => {
  return {
    type: AuthActionTypes.SIGN_OUT,
  };
};

export const updateProfileStart = (updated) => ({
  type: AuthActionTypes.UPDATE_PROFILE_START,
  payload: updated,
});

export const updateProfileSuccess = (userData) => ({
  type: AuthActionTypes.UPDATE_PROFILE_SUCCESS,
  payload: userData,
});

export const updateProfileFailure = (error) => ({
  type: AuthActionTypes.UPDATE_PROFILE_FAILURE,
  payload: error,
});
