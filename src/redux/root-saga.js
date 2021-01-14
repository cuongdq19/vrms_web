import { all, call } from 'redux-saga/effects';

import userSagas from './user/user.sagas';
import manufacturerSagas from './manufacturer/manufacturer.sagas';
import serviceSagas from './service/service.sagas';
import modelSagas from './model/model.sagas';
import partSagas from './part/part.sagas';
import packageSagas from './package/package.sagas';
import sectionSagas from './section/section.sagas';
import categorySagas from './category/category.sagas';
import requestSagas from './request/request.sagas';

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(manufacturerSagas),
    call(serviceSagas),
    call(modelSagas),
    call(partSagas),
    call(packageSagas),
    call(sectionSagas),
    call(categorySagas),
    call(requestSagas),
  ]);
}
