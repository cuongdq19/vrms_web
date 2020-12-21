import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import commonReducer from './reducers/common';
import authReducer from './reducers/auth';
import watchAll from './sagas';

const composeEnhancers = composeWithDevTools({});

const commonPersistConfig = {
  key: 'common',
  storage,
};

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['loading'],
};

const rootReducer = combineReducers({
  common: persistReducer(commonPersistConfig, commonReducer),
  auth: persistReducer(authPersistConfig, authReducer),
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchAll);

export const persistor = persistStore(store);
