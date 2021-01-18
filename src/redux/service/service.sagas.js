import { call, all, takeLatest, put, select } from 'redux-saga/effects';
import { message } from 'antd';

import ServiceActionTypes from './service.types';
import { fetchManufacturersStart } from '../manufacturer/manufacturer.actions';
import { fetchModelsStart } from '../model/model.actions';
import {
  fetchServiceTypesSuccess,
  fetchServiceTypesFailure,
  updateServiceSuccess,
  updateServiceFailure,
  fetchServiceTypesSectionsSuccess,
  fetchServiceTypesSectionsFailure,
  createServiceSuccess,
  createServiceFailure,
  removeServiceSuccess,
  removeServiceFailure,
  fetchProviderServicesSuccess,
  fetchProviderServicesFailure,
  loadFormSuccess,
  loadFormFailure,
} from './service.actions';
import http from '../../http';

export function* fetchProviderServices() {
  try {
    const providerId = yield select((state) => state.auth.userData.providerId);
    const data = yield http
      .get(`/maintenance-packages/providers/${providerId}/services`)
      .then(({ data }) => data);
    yield put(fetchProviderServicesSuccess(data));
  } catch (error) {
    yield put(fetchProviderServicesFailure(error));
  }
}

export function* loadFormData() {
  try {
    yield put(fetchManufacturersStart());
    yield put(fetchModelsStart());
    yield call(fetchTypes);
    yield call(fetchTypeSections);
    yield put(loadFormSuccess());
  } catch (error) {
    yield put(loadFormFailure(error));
  }
}

export function* fetchTypes() {
  try {
    const data = yield http.get('/service-types').then(({ data }) => data);
    yield put(fetchServiceTypesSuccess(data));
  } catch (error) {
    yield put(fetchServiceTypesFailure(error));
  }
}

export function* fetchTypeSections() {
  try {
    const data = yield http
      .get('/service-type-details/sections')
      .then(({ data }) => data);
    yield put(fetchServiceTypesSectionsSuccess(data));
  } catch (error) {
    yield put(fetchServiceTypesSectionsFailure(error));
  }
}

export function* createServiceWithParts({
  payload: { history, ...newService },
}) {
  try {
    const {
      typeDetailId: [, typeDetailId],
      name,
      price,
      parts,
      providerId,
    } = newService;
    const body = {
      groupPriceRequest: {
        name,
        partQuantity: parts.reduce(
          (accumulator, item) => ({ ...accumulator, [item.id]: item.quantity }),
          {}
        ),
        price,
      },
      typeDetailId,
    };
    yield http
      .post(`/services/providers/${providerId}/replacing`, body)
      .then(({ data }) => data);
    yield put(createServiceSuccess());
    message.success('Create successfully');
    history.replace('/services');
  } catch (error) {
    yield put(createServiceFailure(error));
  }
}

export function* updateServiceWithParts({
  payload: { history, ...updatedService },
}) {
  try {
    const { name, price, parts, id } = updatedService;
    const body = {
      name,
      partQuantity: parts.reduce(
        (accumulator, item) => ({ ...accumulator, [item.id]: item.quantity }),
        {}
      ),
      price,
    };
    yield http.post(`/services/${id}/replacing`, body).then(({ data }) => data);
    yield put(updateServiceSuccess());
    message.success('Update successfully');
    history.replace('/services');
  } catch (error) {
    yield put(updateServiceFailure(error));
  }
}

export function* updateServiceWithoutParts({
  payload: { history, ...updatedService },
}) {
  try {
    const {
      id,
      modelIds,
      price,
      name,
      typeDetailId: [, typeDetailId],
    } = updatedService;
    const body = {
      modelIds,
      price,
      serviceName: name,
      typeDetailId,
    };
    yield http
      .post(`/services/${id}/non-replacing`, body)
      .then(({ data }) => data);
    yield put(updateServiceSuccess());
    message.success('Update successfully');
    history.replace('/services');
  } catch (error) {
    yield put(updateServiceFailure(error));
  }
}

export function* createServiceWithoutParts({
  payload: { history, ...newService },
}) {
  try {
    const {
      modelIds,
      price,
      name,
      typeDetailId: [, typeDetailId],
      providerId,
    } = newService;
    const body = {
      modelIds: modelIds,
      price,
      serviceName: name,
      typeDetailId,
    };
    yield http
      .post(`/services/providers/${providerId}/non-replacing`, body)
      .then(({ data }) => data);
    yield put(createServiceSuccess());
    message.success('Create successfully');
    history.replace('/services');
  } catch (error) {
    yield put(createServiceFailure(error));
  }
}

export function* removeService({ payload: { serviceId, providerId } }) {
  try {
    yield http.delete(`/services/${serviceId}`).then(({ data }) => data);
    message.success('Service removed.');
    yield put(removeServiceSuccess());
    yield call(fetchProviderServices);
  } catch (error) {
    yield put(removeServiceFailure(error));
  }
}

export function* onFetchProviderServices() {
  yield takeLatest(
    ServiceActionTypes.FETCH_PROVIDER_SERVICES_START,
    fetchProviderServices
  );
}

export function* onLoadForm() {
  yield takeLatest(ServiceActionTypes.LOAD_FORM_START, loadFormData);
}

export function* onFetchTypes() {
  yield takeLatest(ServiceActionTypes.FETCH_SERVICE_TYPES_START, fetchTypes);
}

export function* onFetchTypeSections() {
  yield takeLatest(
    ServiceActionTypes.FETCH_SERVICE_TYPES_SECTIONS_START,
    fetchTypeSections
  );
}

export function* onCreateServiceWithPartsStart() {
  yield takeLatest(
    ServiceActionTypes.CREATE_SERVICE_WITH_PARTS_START,
    createServiceWithParts
  );
}

export function* onCreateServiceWithoutPartsStart() {
  yield takeLatest(
    ServiceActionTypes.CREATE_SERVICE_WITHOUT_PARTS_START,
    createServiceWithoutParts
  );
}

export function* onUpdateServiceWithPartsStart() {
  yield takeLatest(
    ServiceActionTypes.UPDATE_SERVICE_WITH_PARTS_START,
    updateServiceWithParts
  );
}

export function* onUpdateServiceWithoutPartsStart() {
  yield takeLatest(
    ServiceActionTypes.UPDATE_SERVICE_WITHOUT_PARTS_START,
    updateServiceWithoutParts
  );
}

export function* onRemoveService() {
  yield takeLatest(ServiceActionTypes.REMOVE_SERVICE_START, removeService);
}

export default function* serviceSagas() {
  yield all([
    call(onFetchProviderServices),
    call(onLoadForm),
    call(onFetchTypes),
    call(onCreateServiceWithPartsStart),
    call(onCreateServiceWithoutPartsStart),
    call(onUpdateServiceWithPartsStart),
    call(onUpdateServiceWithoutPartsStart),
    call(onFetchTypeSections),
    call(onRemoveService),
  ]);
}
