import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

import commonReducer from './common/common.reducer';
import userReducer from './user/user.reducer';
import manufacturerReducer from './manufacturer/manufacturer.reducer';
import modelReducer from './model/model.reducer';
import serviceReducer from './service/service.reducer';
import partReducer from './part/part.reducer';

// const commonPersistConfig = {
//   key: 'common',
//   storage,
// };

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['loading'],
};

const rootReducer = combineReducers({
  common: commonReducer,
  auth: persistReducer(userPersistConfig, userReducer),
  manufacturers: manufacturerReducer,
  models: modelReducer,
  services: serviceReducer,
  parts: partReducer,
});

export default rootReducer;
