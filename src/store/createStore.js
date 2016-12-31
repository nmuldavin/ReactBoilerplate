/**
 * @module store/createStore
 * Produces configured redux store
 */
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-most';
import rootReducer from './reducers/rootReducer';
import rootEpic from './epics/rootEpic';

/**
 * Get devtools compose or use regular redux compose
 */
const composeEnhancers = ENV_DEV ? composeWithDevTools : compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

/**
 * Create store with composer and root reducer
 */
const store = createStore(
  rootReducer,
  undefined,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
);

export default store;
