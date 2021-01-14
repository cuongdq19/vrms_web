import { createSelector } from 'reselect';

const selectService = (state) => state.services;

export const selectIsLoadingForm = createSelector(
  [selectService],
  (service) => service.isFetching
);
