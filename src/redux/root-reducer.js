import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

import commonReducer from './common/common.reducer';
import authReducer from './auth/auth.reducer';
import manufacturerReducer from './manufacturer/manufacturer.reducer';
import modelReducer from './model/model.reducer';
import serviceReducer from './service/service.reducer';
import partReducer from './part/part.reducer';
import packageReducer from './package/package.reducer';
import categoryReducer from './category/category.reducer';
import requestReducer from './request/request.reducer';
import userReducer from './user/user.reducer';

// const commonPersistConfig = {
//   key: 'common',
//   storage,
// };

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['loading'],
};

const rootReducer = combineReducers({
  common: commonReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  manufacturers: manufacturerReducer,
  models: modelReducer,
  services: serviceReducer,
  parts: partReducer,
  packages: packageReducer,
  categories: categoryReducer,
  requests: requestReducer,
  users: userReducer,
});

export default rootReducer;
