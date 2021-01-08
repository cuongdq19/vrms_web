import UserActionTypes from './user.types';
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

const signOut = (state, action) => {
  return updateObject(state, {
    loading: false,
    userData: null,
  });
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN:
      return signIn(state, action);
    case UserActionTypes.SIGN_IN_SUCCESS:
      return signInSuccess(state, action);
    case UserActionTypes.SIGN_OUT:
      return signOut(state, action);
    default:
      return state;
  }
};

export default userReducer;
