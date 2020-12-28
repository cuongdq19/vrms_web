import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  id: 0,
  expenses: [],
  services: [],
};

const initUpdateRequest = (state, action) => {
  return updateObject(state, {
    id: action.payload.id,
    expenses: action.payload.expenses,
    services: action.payload.services,
  });
};

const resetUpdateRequest = (state, action) => {
  return initialState;
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_UPDATE_REQUEST:
      return initUpdateRequest(state, action);
    case actionTypes.RESET_UPDATE_REQUEST:
      return resetUpdateRequest(state, action);
    default:
      return state;
  }
};

export default reducer;
