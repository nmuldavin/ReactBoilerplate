/**
 * @module store/reducers/rootReducer
 * Creates root redux reducer
 */
import { combineReducers } from 'redux';
import ping from './ping/ping';

/**
 * Root reducer
 */
export default combineReducers({
  ping,
});
