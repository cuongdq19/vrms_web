import PackageActionTypes from './package.types';

export const fetchPackagesStart = () => ({
  type: PackageActionTypes.FETCH_PACKAGES_START,
});

export const fetchPackagesSuccess = (packagesData) => ({
  type: PackageActionTypes.FETCH_PACKAGES_SUCCESS,
  payload: packagesData,
});

export const fetchPackagesFailure = (error) => ({
  type: PackageActionTypes.FETCH_PACKAGES_FAILURE,
  payload: error,
});

export const loadPackageFormStart = () => ({
  type: PackageActionTypes.LOAD_PACKAGE_FORM_START,
});

export const loadPackageFormSuccess = () => ({
  type: PackageActionTypes.LOAD_PACKAGE_FORM_SUCCESS,
});

export const loadPackageFormFailure = (error) => ({
  type: PackageActionTypes.LOAD_PACKAGE_FORM_FAILURE,
  payload: error,
});

export const fetchMilestonesStart = () => ({
  type: PackageActionTypes.FETCH_MILESTONES_START,
});

export const fetchMilestonesSuccess = (milestonesData) => ({
  type: PackageActionTypes.FETCH_MILESTONES_SUCCESS,
  payload: milestonesData,
});

export const fetchMilestonesFailure = (error) => ({
  type: PackageActionTypes.FETCH_MILESTONES_FAILURE,
  payload: error,
});

export const createPackageStart = (newPackage) => ({
  type: PackageActionTypes.CREATE_PACKAGE_START,
  payload: newPackage,
});

export const createPackageSuccess = () => ({
  type: PackageActionTypes.CREATE_PACKAGE_SUCCESS,
});

export const createPackageFailure = (error) => ({
  type: PackageActionTypes.CREATE_PACKAGE_FAILURE,
  payload: error,
});

export const updatePackageStart = (updatedPackage) => ({
  type: PackageActionTypes.UPDATE_PACKAGE_START,
  payload: updatedPackage,
});

export const updatePackageSuccess = () => ({
  type: PackageActionTypes.UPDATE_PACKAGE_SUCCESS,
});

export const updatePackageFailure = (error) => ({
  type: PackageActionTypes.UPDATE_PACKAGE_FAILURE,
  payload: error,
});

export const removePackageStart = (packageItem) => ({
  type: PackageActionTypes.REMOVE_PACKAGE_START,
  payload: packageItem,
});

export const removePackageSuccess = () => ({
  type: PackageActionTypes.REMOVE_PACKAGE_SUCCESS,
});

export const removePackageFailure = (error) => ({
  type: PackageActionTypes.REMOVE_PACKAGE_FAILURE,
  payload: error,
});
