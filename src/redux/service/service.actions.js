import ServiceActionTypes from './service.types';

export const fetchProviderServicesStart = () => ({
  type: ServiceActionTypes.FETCH_PROVIDER_SERVICES_START,
});

export const fetchProviderServicesSuccess = (servicesData) => ({
  type: ServiceActionTypes.FETCH_PROVIDER_SERVICES_SUCCESS,
  payload: servicesData,
});

export const fetchProviderServicesFailure = (error) => ({
  type: ServiceActionTypes.FETCH_PROVIDER_SERVICES_FAILURE,
  payload: error,
});

export const loadFormStart = () => ({
  type: ServiceActionTypes.LOAD_FORM_START,
});

export const loadFormSuccess = () => ({
  type: ServiceActionTypes.LOAD_FORM_SUCCESS,
});

export const loadFormFailure = (error) => ({
  type: ServiceActionTypes.LOAD_FORM_FAILURE,
  payload: error,
});

export const fetchServiceTypesStart = () => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_START,
});

export const fetchServiceTypesSuccess = (typesData) => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_SUCCESS,
  payload: typesData,
});

export const fetchServiceTypesFailure = (error) => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_FAILURE,
  payload: error,
});

export const fetchServiceTypesSectionsStart = () => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_START,
});

export const fetchServiceTypesSectionsSuccess = (typeSectionsData) => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_SUCCESS,
  payload: typeSectionsData,
});

export const fetchServiceTypesSectionsFailure = (error) => ({
  type: ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_FAILURE,
  payload: error,
});

export const createServiceWithPartsStart = (newService) => ({
  type: ServiceActionTypes.CREATE_SERVICE_WITH_PARTS_START,
  payload: newService,
});

export const createServiceWithoutPartsStart = (newService) => ({
  type: ServiceActionTypes.CREATE_SERVICE_WITHOUT_PARTS_START,
  payload: newService,
});

export const updateServiceWithPartsStart = (updatedService) => ({
  type: ServiceActionTypes.UPDATE_SERVICE_WITH_PARTS_START,
  payload: updatedService,
});

export const updateServiceWithoutPartsStart = (updatedService) => ({
  type: ServiceActionTypes.UPDATE_SERVICE_WITHOUT_PARTS_START,
  payload: updatedService,
});

export const createServiceSuccess = () => ({
  type: ServiceActionTypes.CREATE_SERVICE_SUCCESS,
});

export const createServiceFailure = (error) => ({
  type: ServiceActionTypes.CREATE_SERVICE_FAILURE,
  payload: error,
});

export const updateServiceSuccess = () => ({
  type: ServiceActionTypes.UPDATE_SERVICE_SUCCESS,
});

export const updateServiceFailure = (error) => ({
  type: ServiceActionTypes.UPDATE_SERVICE_FAILURE,
  payload: error,
});

export const removeServiceStart = (id) => ({
  type: ServiceActionTypes.REMOVE_SERVICE_START,
  payload: id,
});

export const removeServiceSuccess = () => ({
  type: ServiceActionTypes.REMOVE_SERVICE_SUCCESS,
});

export const removeServiceFailure = (error) => ({
  type: ServiceActionTypes.REMOVE_SERVICE_FAILURE,
  payload: error,
});
