import { updateObject } from '../../utils';
import CommonActionTypes from './common.types';

const initialState = {
  openKeys: [],
  collapsed: false,
};

const setOpenKeys = (state, action) => {
  return updateObject(state, { openKeys: action.openKeys });
};

const toggleCollapsed = (state, action) => {
  return updateObject(state, {
    collapsed: !state.collapsed,
  });
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case CommonActionTypes.SIDER_SET_OPEN_KEYS:
      return setOpenKeys(state, action);
    case CommonActionTypes.TOGGLE_COLLAPSED:
      return toggleCollapsed(state, action);
    default:
      return state;
  }
};

export default commonReducer;
