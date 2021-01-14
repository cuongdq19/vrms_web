import RequestActionTypes from './request.types';

const INITIAL_STATE = {
  requests: [],
  technicians: [],
  isFetching: false,
  visible: {
    checkIn: false,
    confirm: false,
    checkout: false,
  },
  isUpdating: false,
  error: null,
};

const requestReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RequestActionTypes.FETCH_REQUESTS_START:
    case RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_START:
      return {
        ...state,
        isFetching: true,
      };
    case RequestActionTypes.FETCH_REQUESTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        requests: action.payload,
      };
    case RequestActionTypes.FETCH_REQUESTS_FAILURE:
    case RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case RequestActionTypes.CHECK_IN_REQUEST_START:
    case RequestActionTypes.CONFIRM_REQUEST_START:
    case RequestActionTypes.COMPLETE_REQUEST_START:
    case RequestActionTypes.CHECKOUT_REQUEST_START:
      return {
        ...state,
        isUpdating: true,
      };
    case RequestActionTypes.CHECK_IN_REQUEST_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        visible: { ...state.visible, checkIn: false },
      };
    case RequestActionTypes.CHECK_IN_REQUEST_FAILURE:
    case RequestActionTypes.CONFIRM_REQUEST_FAILURE:
    case RequestActionTypes.COMPLETE_REQUEST_FAILURE:
    case RequestActionTypes.CHECKOUT_REQUEST_FAILURE:
      return {
        ...state,
        isUpdating: false,
        error: action.payload,
      };
    case RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        technicians: action.payload,
      };
    case RequestActionTypes.SHOW_MODAL:
      return {
        ...state,
        visible: { ...state.visible, [action.payload]: true },
      };
    case RequestActionTypes.HIDE_MODAL:
      return {
        ...state,
        visible: { ...state.visible, [action.payload]: false },
      };
    case RequestActionTypes.CONFIRM_REQUEST_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        visible: { ...state.visible, confirm: false },
      };
    case RequestActionTypes.COMPLETE_REQUEST_SUCCESS:
      return {
        ...state,
        isUpdating: false,
      };
    case RequestActionTypes.CHECKOUT_REQUEST_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        visible: { ...state.visible, checkout: false },
      };
    default:
      return state;
  }
};

export default requestReducer;
