import PartActionTypes from './part.types';

const INITIAL_STATE = {
  parts: [],
  isFetching: false,
  isLoadingForm: false,
  isCreatingOrUpdating: false,
  isModalVisible: false,
  error: null,
};

const partReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PartActionTypes.CREATE_PART_START:
    case PartActionTypes.UPDATE_PART_START:
      return {
        ...state,
        isCreatingOrUpdating: true,
      };
    case PartActionTypes.CREATE_PART_SUCCESS:
    case PartActionTypes.UPDATE_PART_SUCCESS:
      return {
        ...state,
        isCreatingOrUpdating: false,
        isModalVisible: false,
      };
    case PartActionTypes.CREATE_PART_FAILURE:
    case PartActionTypes.UPDATE_PART_FAILURE:
      return {
        ...state,
        isCreatingOrUpdating: false,
        error: action.payload,
      };
    case PartActionTypes.SHOW_PART_MODAL:
      return {
        ...state,
        isModalVisible: true,
      };
    case PartActionTypes.CLOSE_PART_MODAL:
      return {
        ...state,
        isModalVisible: false,
      };
    case PartActionTypes.LOAD_PART_FORM_START:
      return {
        ...state,
        isLoadingForm: true,
      };
    case PartActionTypes.LOAD_PART_FORM_SUCCESS:
      return {
        ...state,
        isLoadingForm: false,
      };
    case PartActionTypes.LOAD_PART_FORM_FAILURE:
      return {
        ...state,
        isLoadingForm: false,
        error: action.payload,
      };
    case PartActionTypes.FETCH_PARTS_START:
      return {
        ...state,
        isFetching: true,
      };
    case PartActionTypes.FETCH_PARTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        parts: action.payload,
      };
    case PartActionTypes.FETCH_PARTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default partReducer;
