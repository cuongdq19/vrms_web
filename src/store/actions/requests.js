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

export const addServiceToRequest = (newService) => {
  return {
    type: actionTypes.ADD_SERVICE_TO_REQUEST,
    newService,
  };
};

export const removeServiceFromRequest = (serviceId) => {
  return {
    type: actionTypes.REMOVE_SERVICE_FROM_REQUEST,
    serviceId,
  };
};

export const removeExpenseFromRequest = (expenseId) => {
  return {
    type: actionTypes.REMOVE_EXPENSE_FROM_REQUEST,
    expenseId,
  };
};
