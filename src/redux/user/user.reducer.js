import UserActionTypes from './user.types';

const INITIAL_STATE = {
  users: [],
  isFetching: false,
  isCreatingOrUpdating: false,
  visible: false,
  error: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.FETCH_USERS_START:
    case UserActionTypes.TOGGLE_USER_ACTIVE_START:
      return {
        ...state,
        isFetching: true,
      };
    case UserActionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload,
      };
    case UserActionTypes.FETCH_USERS_FAILURE:
    case UserActionTypes.TOGGLE_USER_ACTIVE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case UserActionTypes.TOGGLE_USER_ACTIVE_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case UserActionTypes.SHOW_USER_MODAL:
      return {
        ...state,
        visible: true,
      };
    case UserActionTypes.HIDE_USER_MODAL:
      return {
        ...state,
        visible: false,
      };
    case UserActionTypes.CREATE_USER_START:
    case UserActionTypes.UPDATE_USER_START:
      return {
        ...state,
        isCreatingOrUpdating: true,
      };
    case UserActionTypes.CREATE_USER_SUCCESS:
    case UserActionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isCreatingOrUpdating: false,
        visible: false,
      };
    case UserActionTypes.CREATE_USER_FAILURE:
    case UserActionTypes.UPDATE_USER_FAILURE:
      return {
        ...state,
        isCreatingOrUpdating: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
