import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root-reducer';
import rootSaga from './root-saga';
import CommonActionTypes from './common/common.types';

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== CommonActionTypes.SIDER_SET_OPEN_KEYS,
});

const middlewares = [sagaMiddleware, logger];

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default { store, persistStore };
