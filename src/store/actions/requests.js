import * as actionTypes from './actionTypes';

export const setUpdatingRequest = (request) => {
  return {
    type: actionTypes.SET_UPDATING_REQUEST,
    request,
  };
};
