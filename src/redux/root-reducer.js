import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

import commonReducer from './common/common.reducer';
import userReducer from './user/user.reducer';

const commonPersistConfig = {
  key: 'common',
  storage,
};

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['loading'],
};

const rootReducer = combineReducers({
  common: persistReducer(commonPersistConfig, commonReducer),
  auth: persistReducer(userPersistConfig, userReducer),
});

export default rootReducer;
