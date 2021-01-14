import PartActionTypes from './part.types';

const INITIAL_STATE = {
  parts: [],
  isFetching: false,
  error: null,
};

const partReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PartActionTypes.FETCH_PARTS_START:
      return {
        ...state,
        isFetching: true,
      };
    case PartActionTypes.FETCH_PARTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        parts: action.payload,
      };
    case PartActionTypes.FETCH_PARTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default partReducer;
