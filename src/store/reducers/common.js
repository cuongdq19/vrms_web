import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  openKeys: [],
};

const setOpenKeys = (state, action) => {
  return updateObject(state, { openKeys: action.openKeys });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIDER_SET_OPEN_KEYS:
      return setOpenKeys(state, action);
    default:
      return state;
  }
};

export default reducer;
