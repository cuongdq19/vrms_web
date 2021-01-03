import * as actionTypes from './actionTypes';

export const fetchServicePackages = () => {
  return {
    type: actionTypes.FETCH_SERVICE_PACKAGES,
  };
};

export const fetchServicePackagesSuccess = (packagesData) => {
  return {
    type: actionTypes.FETCH_SERVICE_PACKAGES_SUCCESS,
    packagesData,
  };
};

export const createServicePackage = (newPackage) => {
  return {
    type: actionTypes.CREATE_SERVICE_PACKAGE,
    newPackage,
  };
};
