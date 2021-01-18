import { updateObject } from '../../utils';
import CommonActionTypes from './common.types';

const initialState = {
  openKeys: [],
  collapsed: false,
  selected: null,
};

const setOpenKeys = (state, action) => {
  return updateObject(state, { openKeys: action.openKeys });
};

const toggleCollapsed = (state, action) => {
  return updateObject(state, {
    collapsed: !state.collapsed,
  });
};

const setSelectedMenu = (state, action) => {
  return updateObject(state, {
    selected: action.payload,
  });
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case CommonActionTypes.SIDER_SET_OPEN_KEYS:
      return setOpenKeys(state, action);
    case CommonActionTypes.TOGGLE_COLLAPSED:
      return toggleCollapsed(state, action);
    case CommonActionTypes.SET_SELECTED_MENU:
      return setSelectedMenu(state, action);
    default:
      return state;
  }
};

export default commonReducer;
