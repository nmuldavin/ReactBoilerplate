/**
 * @module epics/ping
 * Epics for pinging and ponging
 */
import actionTypes from '../../actionTypes';

/**
 * pingEpic
 * upon Ping action, waits 1 second then emits Pong action
 * @param  {Stream} action - stream of redux actions
 * @return {Stream} - string of new redux actions
 */
const pingEpic = action =>
  action
    .ofType(actionTypes.PING)
    .delay(1000)
    .map(() => ({ type: actionTypes.PONG }));

export default pingEpic;
