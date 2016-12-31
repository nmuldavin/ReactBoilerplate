/**
 * @module store/reducers/pingPong
 * reducers for ping state
 */
import actionTypes from '../../actionTypes';

/**
 * ping - Reducer controlling ping store
 * @param  {Object} state={ isPinging: false } - Current ping state
 * @param  {Object} action - Store action
 * @return {Object} new ping state
 */
const ping = (state = { isPinging: false }, action) => {
  switch (action.type) {
    case actionTypes.PING:
      return { isPinging: true };

    case actionTypes.EPIC_RELOAD:
    case actionTypes.PONG:
      return { isPinging: false };

    default:
      return state;
  }
};

export default ping;
