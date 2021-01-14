import ModelActionTypes from './model.types';

export const fetchModelsStart = () => ({
  type: ModelActionTypes.FETCH_MODELS_START,
});

export const fetchModelsSuccess = (modelsData) => ({
  type: ModelActionTypes.FETCH_MODELS_SUCCESS,
  payload: modelsData,
});

export const fetchModelsFailure = (error) => ({
  type: ModelActionTypes.FETCH_MODELS_FAILURE,
  payload: error,
});

export const fetchManufacturersAndModels = () => ({
  type: ModelActionTypes.FETCH_MANUFACTURERS_AND_MODELS,
});
