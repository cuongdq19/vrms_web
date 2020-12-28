import * as actionTypes from './actionTypes';

export const fetchParts = () => {
  return {
    type: actionTypes.FETCH_PARTS,
  };
};

export const fetchPartsSuccess = (partsData) => {
  return {
    type: actionTypes.FETCH_PARTS_SUCCESS,
    payload: partsData,
  };
};

export const fetchPartSectionsWithCategories = () => {
  return {
    type: actionTypes.FETCH_PART_SECTIONS_WITH_CATEGORIES,
  };
};

export const fetchPartSectionsWithCategoriesSuccess = (sectionsData) => {
  return {
    type: actionTypes.FETCH_PART_SECTIONS_WITH_CATEGORIES_SUCCESS,
    payload: sectionsData,
  };
};
