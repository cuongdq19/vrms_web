import PartActionTypes from './part.types';

export const fetchPartsStart = (providerId) => ({
  type: PartActionTypes.FETCH_PARTS_START,
  payload: { providerId },
});

export const fetchPartsSuccess = (partsData) => ({
  type: PartActionTypes.FETCH_PARTS_SUCCESS,
  payload: partsData,
});

export const fetchPartsFailure = (error) => ({
  type: PartActionTypes.FETCH_PARTS_FAILURE,
  payload: error,
});
