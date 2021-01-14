import PackageActionTypes from './package.types';

const INITIAL_STATE = {
  packages: [],
  isFetching: false,
  isLoadingForm: false,
  isCreatingOrUpdating: false,
  milestones: [],
  error: null,
};

const packageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PackageActionTypes.CREATE_PACKAGE_START:
    case PackageActionTypes.UPDATE_PACKAGE_START:
    case PackageActionTypes.REMOVE_PACKAGE_START:
      return {
        ...state,
        isCreatingOrUpdating: true,
      };
    case PackageActionTypes.CREATE_PACKAGE_SUCCESS:
    case PackageActionTypes.UPDATE_PACKAGE_SUCCESS:
    case PackageActionTypes.REMOVE_PACKAGE_SUCCESS:
      return {
        ...state,
        isCreatingOrUpdating: false,
      };
    case PackageActionTypes.CREATE_PACKAGE_FAILURE:
    case PackageActionTypes.UPDATE_PACKAGE_FAILURE:
    case PackageActionTypes.REMOVE_PACKAGE_FAILURE:
      return {
        ...state,
        isCreatingOrUpdating: false,
        error: action.payload,
      };
    case PackageActionTypes.FETCH_PACKAGES_START:
    case PackageActionTypes.FETCH_MILESTONES_START:
      return {
        ...state,
        isFetching: true,
      };
    case PackageActionTypes.FETCH_PACKAGES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        packages: action.payload,
      };
    case PackageActionTypes.FETCH_PACKAGES_FAILURE:
    case PackageActionTypes.FETCH_MILESTONES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case PackageActionTypes.LOAD_PACKAGE_FORM_START:
      return {
        ...state,
        isLoadingForm: true,
      };
    case PackageActionTypes.LOAD_PACKAGE_FORM_SUCCESS:
      return {
        ...state,
        isLoadingForm: false,
      };
    case PackageActionTypes.LOAD_PACKAGE_FORM_FAILURE:
      return {
        ...state,
        isLoadingForm: false,
        error: action.payload,
      };
    case PackageActionTypes.FETCH_MILESTONES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        milestones: action.payload,
      };
    default:
      return state;
  }
};

export default packageReducer;
