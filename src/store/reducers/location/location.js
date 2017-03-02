/**
 * @module store/reducers/location
 * reducers for location state
 */
import actionTypes from '../../actionTypes';

/**
 * ping - Reducer controlling ping store
 * @param  {Object} [state=null] - Current location
 * @param  {Object} action - Store action
 * @return {Object} new ping state
 */
const location = (state = null, action) => {
  switch (action.type) {
    case actionTypes.LOCATION_CHANGE:
      return action.location;
    default:
      return state;
  }
};

export default location;
