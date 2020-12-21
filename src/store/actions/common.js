import * as actionTypes from './actionTypes';

export const setOpenKeys = (openKeys) => {
  return {
    type: actionTypes.SIDER_SET_OPEN_KEYS,
    openKeys,
  };
};
