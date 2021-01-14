import ServiceActionTypes from './service.types';

const INITIAL_STATE = {
  services: [],
  types: [],
  typeSections: [],
  isFetching: false,
  isCreatingOrUpdating: false,
  isLoadingForm: false,
  error: null,
};

const serviceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ServiceActionTypes.LOAD_FORM_START:
      return {
        ...state,
        isLoadingForm: true,
      };
    case ServiceActionTypes.LOAD_FORM_SUCCESS:
      return {
        ...state,
        isLoadingForm: false,
      };
    case ServiceActionTypes.LOAD_FORM_FAILURE:
      return {
        ...state,
        isLoadingForm: false,
        error: action.payload,
      };
    case ServiceActionTypes.FETCH_SERVICE_TYPES_START:
    case ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_START:
    case ServiceActionTypes.FETCH_PROVIDER_SERVICES_START:
      return {
        ...state,
        isFetching: true,
      };
    case ServiceActionTypes.FETCH_PROVIDER_SERVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        services: action.payload,
      };
    case ServiceActionTypes.FETCH_SERVICE_TYPES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        types: action.payload,
      };
    case ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        typeSections: action.payload,
      };
    case ServiceActionTypes.FETCH_SERVICE_TYPES_FAILURE:
    case ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_FAILURE:
    case ServiceActionTypes.FETCH_PROVIDER_SERVICES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case ServiceActionTypes.CREATE_SERVICE_WITH_PARTS_START:
    case ServiceActionTypes.CREATE_SERVICE_WITHOUT_PARTS_START:
    case ServiceActionTypes.UPDATE_SERVICE_WITH_PARTS_START:
    case ServiceActionTypes.UPDATE_SERVICE_WITHOUT_PARTS_START:
    case ServiceActionTypes.REMOVE_SERVICE_START:
      return {
        ...state,
        isCreatingOrUpdating: true,
      };
    case ServiceActionTypes.CREATE_SERVICE_SUCCESS:
    case ServiceActionTypes.UPDATE_SERVICE_SUCCESS:
    case ServiceActionTypes.REMOVE_SERVICE_SUCCESS:
      return {
        ...state,
        isCreatingOrUpdating: false,
      };
    case ServiceActionTypes.CREATE_SERVICE_FAILURE:
    case ServiceActionTypes.UPDATE_SERVICE_FAILURE:
    case ServiceActionTypes.REMOVE_SERVICE_FAILURE:
      return {
        ...state,
        isCreatingOrUpdating: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default serviceReducer;
