import CommonActionTypes from './common.types';

export const setOpenKeys = (openKeys) => {
  return {
    type: CommonActionTypes.SIDER_SET_OPEN_KEYS,
    openKeys,
  };
};
