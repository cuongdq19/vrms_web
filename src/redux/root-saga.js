import { all, call } from 'redux-saga/effects';

import authSagas from './auth/auth.sagas';
import manufacturerSagas from './manufacturer/manufacturer.sagas';
import serviceSagas from './service/service.sagas';
import modelSagas from './model/model.sagas';
import partSagas from './part/part.sagas';
import packageSagas from './package/package.sagas';
import sectionSagas from './section/section.sagas';
import categorySagas from './category/category.sagas';
import requestSagas from './request/request.sagas';
import userSagas from './user/user.sagas';

export default function* rootSaga() {
  yield all([
    call(authSagas),
    call(manufacturerSagas),
    call(serviceSagas),
    call(modelSagas),
    call(partSagas),
    call(packageSagas),
    call(sectionSagas),
    call(categorySagas),
    call(requestSagas),
    call(userSagas),
  ]);
}
