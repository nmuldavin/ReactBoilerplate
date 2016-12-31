/**
 * @module epics/rootEpic
 * Defines root epic stream transformation
 */
import { combineEpics } from 'redux-most';
import ping from './ping/ping';

/**
 * rootEpic
 * takes stream of actions, returns new stream of actions
 * @param  {Stream} - stream of redux actions
 * @return {Stream} - stream of new redux actions
 */
const rootEpic = combineEpics(
  ping
);

export default rootEpic;
