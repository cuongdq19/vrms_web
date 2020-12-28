import * as actionTypes from './actionTypes';

export const initModifyService = () => {
  return {
    type: actionTypes.INIT_MODIFY_SERVICE,
  };
};

export const initModifyServiceWithParts = () => {
  return {
    type: actionTypes.INIT_MODIFY_SERVICE_WITH_PARTS,
  };
};

export const fetchServiceTypes = () => {
  return {
    type: actionTypes.FETCH_SERVICE_TYPES,
  };
};

export const fetchServiceTypesSuccess = (serviceTypesData) => {
  return {
    type: actionTypes.FETCH_SERVICE_TYPES_SUCCESS,
    payload: serviceTypesData,
  };
};

export const fetchServiceSections = (typeId) => {
  return {
    type: actionTypes.FETCH_SERVICE_SECTIONS,
    typeId,
  };
};

export const fetchServiceSectionsSuccess = (sectionsData) => {
  return {
    type: actionTypes.FETCH_SERVICE_SECTIONS_SUCCESS,
    payload: sectionsData,
  };
};
