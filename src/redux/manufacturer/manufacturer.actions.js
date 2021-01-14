import ManufacturerActionTypes from './manufacturer.types';

export const fetchManufacturersStart = () => ({
  type: ManufacturerActionTypes.FETCH_MANUFACTURERS_START,
});

export const fetchManufacturersSuccess = (manufacturersData) => ({
  type: ManufacturerActionTypes.FETCH_MANUFACTURERS_SUCCESS,
  payload: manufacturersData,
});

export const fetchManufacturersFailure = (errorMessage) => ({
  type: ManufacturerActionTypes.FETCH_MANUFACTURERS_FAILURE,
  payload: errorMessage,
});
