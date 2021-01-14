import ManufacturerActionTypes from './manufacturer.types';

const INITIAL_STATE = {
  manufacturers: [],
  isFetching: false,
  error: null,
};

const manufacturerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ManufacturerActionTypes.FETCH_MANUFACTURERS_START:
      return {
        ...state,
        isFetching: true,
      };
    case ManufacturerActionTypes.FETCH_MANUFACTURERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        manufacturers: action.payload,
      };
    case ManufacturerActionTypes.FETCH_MANUFACTURERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default manufacturerReducer;
