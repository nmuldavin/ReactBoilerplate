/**
 * @module store/createStore
 * Produces configured redux store
 */
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/rootReducer';
// import { createEpicMiddleware } from 'redux-most';

/**
 * Get devtools compose or use regular redux compose
 */
const composeEnhancers = ENV_DEV ? composeWithDevTools : compose;

/**
 * Create store with composer and root reducer
 * @type {[type]}
 */
const store = createStore(
  rootReducer,
  undefined,
  composeEnhancers(
    applyMiddleware()
  )
);

export default store;
