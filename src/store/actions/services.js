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

export const initUpdateService = (typeDetail, serviceDetail) => {
  return {
    type: actionTypes.INIT_UPDATE_SERVICE,
    payload: { typeDetail, serviceDetail },
  };
};

export const initUpdateServiceWithParts = (typeDetail, serviceDetail) => {
  return {
    type: actionTypes.INIT_UPDATE_SERVICE_WITH_PARTS,
    payload: { typeDetail, serviceDetail },
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

export const fetchServicesByProviderAndType = (typeId) => {
  return {
    type: actionTypes.FETCH_SERVICES_BY_PROVIDER_AND_TYPE,
    typeId,
  };
};

export const fetchServicesSuccess = (servicesData) => {
  return {
    type: actionTypes.FETCH_SERVICES_SUCCESS,
    payload: servicesData,
  };
};
