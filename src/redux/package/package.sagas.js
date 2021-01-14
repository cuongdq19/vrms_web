import { put, all, call, takeLatest, select } from 'redux-saga/effects';

import PackageActionTypes from './package.types';
import {
  fetchPackagesSuccess,
  fetchPackagesFailure,
  loadPackageFormSuccess,
  loadPackageFormFailure,
  fetchMilestonesSuccess,
  createPackageSuccess,
  createPackageFailure,
  updatePackageSuccess,
  updatePackageFailure,
  removePackageSuccess,
  removePackageFailure,
} from './package.actions';
import { fetchProviderServices } from '../service/service.sagas';
import http from '../../http';
import { message } from 'antd';

export function* fetchPackagesAsync() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);

    const data = yield http
      .get(`/maintenance-packages/providers/${providerId}`)
      .then(({ data }) =>
        data.map(({ packagedServices, ...rest }) => ({
          services: packagedServices,
          ...rest,
        }))
      );
    yield put(fetchPackagesSuccess(data));
  } catch (error) {
    yield put(fetchPackagesFailure(error));
  }
}

export function* loadPackageFormData() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    yield call(fetchProviderServices, { payload: { providerId } });
    yield put(loadPackageFormSuccess());
  } catch (error) {
    yield put(loadPackageFormFailure(error));
  }
}

export function* fetchMilestones() {
  try {
    const data = yield http
      .get('/maintenance-packages/milestones')
      .then(({ data }) => data);
    yield put(fetchMilestonesSuccess(data));
  } catch (error) {
    yield put(fetchPackagesFailure(error));
  }
}

export function* createPackage({ payload }) {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const {
      history,
      milestone = null,
      name,
      sectionId = null,
      serviceIds,
    } = payload;
    const milestoneId = yield select(
      (state) =>
        state.packages.milestones.find((m) => m.milestone === milestone)?.id
    );
    const body = {
      milestoneId,
      packageName: name,
      sectionId,
      serviceIds,
    };
    yield http
      .post(`/maintenance-packages/providers/${providerId}`, body)
      .then(({ data }) => data);
    yield put(createPackageSuccess());
    message.success('Created successfully');
    history.replace('/packages');
  } catch (error) {
    message.error('Created failed.');
    yield put(createPackageFailure(error));
  }
}

export function* updatePackage({ payload }) {
  try {
    const {
      id,
      history,
      milestone = null,
      name,
      sectionId = null,
      serviceIds,
    } = payload;
    const milestoneId = yield select(
      (state) =>
        state.packages.milestones.find((m) => m.milestone === milestone)?.id
    );
    const body = {
      milestoneId,
      packageName: name,
      sectionId,
      serviceIds,
    };
    yield http
      .post(`/maintenance-packages/${id}`, body)
      .then(({ data }) => data);
    yield put(updatePackageSuccess());
    message.success('Update successfully');
    history.replace('/packages');
  } catch (error) {
    yield put(updatePackageFailure(error));
  }
}

export function* removePackage({ payload }) {
  try {
    yield http
      .delete(`/maintenance-packages/packages/${payload}`)
      .then(({ data }) => data);
    yield put(removePackageSuccess());
    yield call(fetchPackagesAsync);
    message.success('Removed successfully');
  } catch (error) {
    message.error('Created failed.');
    yield put(removePackageFailure(error));
  }
}

export function* onLoadPackageForm() {
  yield takeLatest(
    PackageActionTypes.LOAD_PACKAGE_FORM_START,
    loadPackageFormData
  );
}

export function* onFetchMilestones() {
  yield takeLatest(PackageActionTypes.FETCH_MILESTONES_START, fetchMilestones);
}

export function* onFetchPackages() {
  yield takeLatest(PackageActionTypes.FETCH_PACKAGES_START, fetchPackagesAsync);
}

export function* onCreatePackage() {
  yield takeLatest(PackageActionTypes.CREATE_PACKAGE_START, createPackage);
}

export function* onUpdatePackage() {
  yield takeLatest(PackageActionTypes.UPDATE_PACKAGE_START, updatePackage);
}

export function* onRemovePackage() {
  yield takeLatest(PackageActionTypes.REMOVE_PACKAGE_START, removePackage);
}

export default function* packageSagas() {
  yield all([
    call(onFetchPackages),
    call(onLoadPackageForm),
    call(onFetchMilestones),
    call(onCreatePackage),
    call(onUpdatePackage),
    call(onRemovePackage),
  ]);
}
