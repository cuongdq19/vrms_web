import { updateObject } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  id: 0,
  expenses: [],
  services: [],
  requests: [],
};

const initUpdateRequest = (state, action) => {
  return updateObject(state, {
    id: action.payload.id,
    expenses: action.payload.services.filter((ser) => !ser.serviceId),
    services: action.payload.services.filter((ser) => ser.serviceId),
  });
};

const resetUpdateRequest = (state, action) => {
  return updateObject(state, {
    expenses: [],
    services: [],
    id: 0,
  });
};

const addServiceToRequest = (state, action) => {
  return updateObject(state, {
    services: [...state.services, action.newService],
  });
};

const removeServiceFromRequest = (state, action) => {
  const updatedServices = [...state.services];
  const index = updatedServices.findIndex(
    (ser) => ser.serviceId === action.serviceId
  );
  if (index >= 0) {
    updatedServices.splice(index, 1);
  }
  return updateObject(state, { services: updatedServices });
};

const removeExpenseFromRequest = (state, action) => {
  const updatedExpenses = [...state.expenses];
  const index = updatedExpenses.findIndex((exp) => exp.id === action.expenseId);
  if (index >= 0) {
    updatedExpenses.splice(index, 1);
  }
  return updateObject(state, { expenses: updatedExpenses });
};

const addExpenseToRequest = (state, action) => {
  return updateObject(state, {
    expenses: [...state.expenses, action.newExpense],
  });
};

const fetchRequestsSuccess = (state, action) => {
  return updateObject(state, {
    requests: action.requestsData,
  });
};

const updateExpenseToRequest = (state, action) => {
  const updatedExpenses = [...state.expenses];
  const index = updatedExpenses.findIndex(
    (expense) => expense.id === action.updatedExpense.id
  );
  updatedExpenses[index] = action.updatedExpense;
  return updateObject(state, {
    expenses: updatedExpenses,
  });
};

const updatePartsInRequestService = (state, action) => {
  const updatedServices = [...state.services];
  const index = updatedServices.findIndex(
    (ser) => ser.serviceId === action.serviceId
  );
  updatedServices[index].parts = action.updatedParts;
  return updateObject(state, {
    services: updatedServices,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_UPDATE_REQUEST:
      return initUpdateRequest(state, action);
    case actionTypes.RESET_UPDATE_REQUEST:
      return resetUpdateRequest(state, action);
    case actionTypes.ADD_SERVICE_TO_REQUEST:
      return addServiceToRequest(state, action);
    case actionTypes.REMOVE_SERVICE_FROM_REQUEST:
      return removeServiceFromRequest(state, action);
    case actionTypes.REMOVE_EXPENSE_FROM_REQUEST:
      return removeExpenseFromRequest(state, action);
    case actionTypes.ADD_EXPENSE_TO_REQUEST:
      return addExpenseToRequest(state, action);
    case actionTypes.FETCH_REQUESTS_SUCCESS:
      return fetchRequestsSuccess(state, action);
    case actionTypes.UPDATE_EXPENSE_TO_REQUEST:
      return updateExpenseToRequest(state, action);
    case actionTypes.UPDATE_PARTS_IN_REQUEST_SERVICE:
      return updatePartsInRequestService(state, action);
    default:
      return state;
  }
};

export default reducer;
