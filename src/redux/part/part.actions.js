import PartActionTypes from './part.types';

export const fetchPartsStart = () => ({
  type: PartActionTypes.FETCH_PARTS_START,
});

export const fetchPartsSuccess = (partsData) => ({
  type: PartActionTypes.FETCH_PARTS_SUCCESS,
  payload: partsData,
});

export const fetchPartsFailure = (error) => ({
  type: PartActionTypes.FETCH_PARTS_FAILURE,
  payload: error,
});

export const loadPartFormStart = () => ({
  type: PartActionTypes.LOAD_PART_FORM_START,
});

export const loadPartFormSuccess = () => ({
  type: PartActionTypes.LOAD_PART_FORM_SUCCESS,
});

export const loadPartFormFailure = (error) => ({
  type: PartActionTypes.LOAD_PART_FORM_FAILURE,
  payload: error,
});

export const showPartModal = () => ({
  type: PartActionTypes.SHOW_PART_MODAL,
});

export const closePartModal = () => ({
  type: PartActionTypes.CLOSE_PART_MODAL,
});

export const createPartStart = (newPart) => ({
  type: PartActionTypes.CREATE_PART_START,
  payload: newPart,
});

export const createPartSuccess = () => ({
  type: PartActionTypes.CREATE_PART_SUCCESS,
});

export const createPartFailure = (error) => ({
  type: PartActionTypes.CREATE_PART_FAILURE,
  payload: error,
});

export const updatePartStart = (updatedPart) => ({
  type: PartActionTypes.UPDATE_PART_START,
  payload: updatedPart,
});

export const updatePartSuccess = () => ({
  type: PartActionTypes.UPDATE_PART_SUCCESS,
});

export const updatePartFailure = (error) => ({
  type: PartActionTypes.UPDATE_PART_FAILURE,
  payload: error,
});

export const removePartStart = (id) => ({
  type: PartActionTypes.REMOVE_PART_START,
  payload: id,
});

export const removePartSuccess = () => ({
  type: PartActionTypes.REMOVE_PART_SUCCESS,
});

export const removePartFailure = (error) => ({
  type: PartActionTypes.REMOVE_PART_FAILURE,
  payload: error,
});
