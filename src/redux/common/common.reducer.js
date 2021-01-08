import { updateObject } from '../../utils';
import CommonActionTypes from './common.types';

const initialState = {
  openKeys: [],
};

const setOpenKeys = (state, action) => {
  return updateObject(state, { openKeys: action.openKeys });
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case CommonActionTypes.SIDER_SET_OPEN_KEYS:
      return setOpenKeys(state, action);
    default:
      return state;
  }
};

export default commonReducer;
