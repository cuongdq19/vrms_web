import UserActionTypes from './user.types';

export const fetchUsersStart = () => ({
  type: UserActionTypes.FETCH_USERS_START,
});

export const fetchUsersSuccess = (usersData) => ({
  type: UserActionTypes.FETCH_USERS_SUCCESS,
  payload: usersData,
});

export const fetchUsersFailure = (error) => ({
  type: UserActionTypes.FETCH_USERS_FAILURE,
  payload: error,
});

export const createUserStart = (newUser) => ({
  type: UserActionTypes.CREATE_USER_START,
  payload: newUser,
});

export const createUserSuccess = () => ({
  type: UserActionTypes.CREATE_USER_SUCCESS,
});

export const createUserFailure = (error) => ({
  type: UserActionTypes.CREATE_USER_FAILURE,
  payload: error,
});

export const updateUserStart = (newUser) => ({
  type: UserActionTypes.UPDATE_USER_START,
  payload: newUser,
});

export const updateUserSuccess = () => ({
  type: UserActionTypes.UPDATE_USER_SUCCESS,
});

export const updateUserFailure = (error) => ({
  type: UserActionTypes.UPDATE_USER_FAILURE,
  payload: error,
});

export const toggleUserActiveStart = (userId) => ({
  type: UserActionTypes.TOGGLE_USER_ACTIVE_START,
  payload: userId,
});

export const toggleUserActiveSuccess = () => ({
  type: UserActionTypes.TOGGLE_USER_ACTIVE_SUCCESS,
});

export const toggleUserActiveFailure = (error) => ({
  type: UserActionTypes.TOGGLE_USER_ACTIVE_FAILURE,
  payload: error,
});

export const showModal = () => ({
  type: UserActionTypes.SHOW_MODAL,
});

export const hideModal = () => ({
  type: UserActionTypes.HIDE_MODAL,
});
