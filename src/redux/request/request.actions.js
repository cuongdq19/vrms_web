import RequestActionTypes from './request.types';

export const fetchRequestsStart = () => ({
  type: RequestActionTypes.FETCH_REQUESTS_START,
});

export const fetchRequestsSuccess = (data) => ({
  type: RequestActionTypes.FETCH_REQUESTS_SUCCESS,
  payload: data,
});

export const fetchRequestsFailure = (error) => ({
  type: RequestActionTypes.FETCH_REQUESTS_FAILURE,
  payload: error,
});

export const showModal = (modalType) => ({
  type: RequestActionTypes.SHOW_MODAL,
  payload: modalType,
});

export const hideModal = (modalType) => ({
  type: RequestActionTypes.HIDE_MODAL,
  payload: modalType,
});

export const checkInRequestsStart = ({ requestId, technicianId }) => ({
  type: RequestActionTypes.CHECK_IN_REQUEST_START,
  payload: { requestId, technicianId },
});

export const checkInRequestsSuccess = () => ({
  type: RequestActionTypes.CHECK_IN_REQUEST_SUCCESS,
});

export const checkInRequestsFailure = (error) => ({
  type: RequestActionTypes.CHECK_IN_REQUEST_FAILURE,
  payload: error,
});

export const fetchAvailableTechniciansStart = (bookingTime) => ({
  type: RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_START,
  payload: bookingTime,
});

export const fetchAvailableTechniciansSuccess = (techniciansData) => ({
  type: RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_SUCCESS,
  payload: techniciansData,
});

export const fetchAvailableTechniciansFailure = (error) => ({
  type: RequestActionTypes.FETCH_AVAILABLE_TECHNICIANS_FAILURE,
  payload: error,
});

export const confirmRequestStart = (id) => ({
  type: RequestActionTypes.CONFIRM_REQUEST_START,
  payload: id,
});

export const confirmRequestSuccess = () => ({
  type: RequestActionTypes.CONFIRM_REQUEST_SUCCESS,
});

export const confirmRequestFailure = (error) => ({
  type: RequestActionTypes.CONFIRM_REQUEST_FAILURE,
  payload: error,
});

export const completeRequestStart = (id) => ({
  type: RequestActionTypes.COMPLETE_REQUEST_START,
  payload: id,
});

export const completeRequestSuccess = () => ({
  type: RequestActionTypes.COMPLETE_REQUEST_SUCCESS,
});

export const completeRequestFailure = (error) => ({
  type: RequestActionTypes.COMPLETE_REQUEST_FAILURE,
  payload: error,
});

export const checkoutRequestStart = (id) => ({
  type: RequestActionTypes.CHECKOUT_REQUEST_START,
  payload: id,
});

export const checkoutRequestSuccess = () => ({
  type: RequestActionTypes.CHECKOUT_REQUEST_SUCCESS,
});

export const checkoutRequestFailure = (error) => ({
  type: RequestActionTypes.CHECKOUT_REQUEST_FAILURE,
  payload: error,
});
