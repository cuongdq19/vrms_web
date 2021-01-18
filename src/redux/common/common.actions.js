import CommonActionTypes from './common.types';

export const setOpenKeys = (openKeys) => {
  return {
    type: CommonActionTypes.SIDER_SET_OPEN_KEYS,
    openKeys,
  };
};

export const toggleCollapsed = () => {
  return {
    type: CommonActionTypes.TOGGLE_COLLAPSED,
  };
};

export const setSelectedMenu = (menu) => {
  return {
    type: CommonActionTypes.SET_SELECTED_MENU,
    payload: menu,
  };
};
