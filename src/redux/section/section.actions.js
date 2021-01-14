import SectionActionTypes from './section.types';

export const fetchSectionsStart = () => ({
  type: SectionActionTypes.FETCH_SECTIONS_START,
});

export const fetchSectionsSuccess = (sectionsData) => ({
  type: SectionActionTypes.FETCH_SECTIONS_SUCCESS,
  payload: sectionsData,
});

export const fetchSectionsFailure = (error) => ({
  type: SectionActionTypes.FETCH_SECTIONS_FAILURE,
  payload: error,
});
