import * as actionTypes from './actionTypes';

export const initUpdateRequest = (requestData) => {
  return {
    type: actionTypes.INIT_UPDATE_REQUEST,
    payload: requestData,
  };
};

export const resetUpdateRequest = () => {
  return {
    type: actionTypes.RESET_UPDATE_REQUEST,
  };
};
