import * as actionTypes from './actionTypes';

export const fetchManufacturers = () => {
  return {
    type: actionTypes.FETCH_MANUFACTURERS,
  };
};

export const fetchManufacturersSuccess = (manufacturersData) => {
  return {
    type: actionTypes.FETCH_MANUFACTURERS_SUCCESS,
    payload: manufacturersData,
  };
};

export const fetchModels = () => {
  return {
    type: actionTypes.FETCH_MODELS,
  };
};

export const fetchModelsSuccess = (modelsData) => {
  return {
    type: actionTypes.FETCH_MODELS_SUCCESS,
    payload: modelsData,
  };
};
