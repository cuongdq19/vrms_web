import ModelActionTypes from './model.types';

const INITIAL_STATE = {
  models: [],
  isFetching: false,
  error: null,
};

const modelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ModelActionTypes.FETCH_MODELS_START:
      return {
        ...state,
        isFetching: true,
      };
    case ModelActionTypes.FETCH_MODELS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        models: action.payload,
      };
    case ModelActionTypes.FETCH_MODELS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default modelReducer;
