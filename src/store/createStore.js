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

/**
 * create epic middleware with most.js rootEpic
 */
const epicMiddleware = createEpicMiddleware(rootEpic);

/**
 * initStore
 * Initializes store withmiddleware and root reducer
 * @param  {*} initialState - initial store state
 * @return {*} initial store
 */
const initStore = initialState => createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
);

/**
 * initHotStore
 * Initializes store, then sets up hot reloading if in dev environment
 * @see https://github.com/reactjs/react-redux/releases/tag/v2.0.0
 * @param  {*} initialState - initial store state
 * @return {*} initial store
 */

const initHotStore = (initialState) => {
  const store = initStore(initialState);

  /* eslint-disable global-require */
  if (ENV_DEV && module.hot) {
    /*
     * Reducer hot reloading
     */
    module.hot.accept('./reducers/rootReducer', () => {
      const nextRootReducer = require('./reducers/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });

    /*
     * Epic hot reloading
     * NOTE: redux-most will emit an event of type @@redux-most/EPIC_END before
     * replacing root epic. If there is any intermediate state in the store that
     * would be dangerous if persisted, it should reset on this action.
     */
    module.hot.accept('./epics/rootEpic', () => {
      const nextEpic = require('./epics/rootEpic').default;
      epicMiddleware.replaceEpic(nextEpic);
    });
  }
  /* eslint-enable */

  return store;
};

/**
 * Initialize with undefined initial state for now
 */
export default initHotStore();
