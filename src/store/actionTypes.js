/**
 * @module store/actionTypes
 * All redux action types should be defined as constants here. This
 * will make refactoring easy and bug free
 */

/**
 * object containing all action types
 */
const actionTypes = {
  PONG: 'PONG',
  PING: 'PING',
  EPIC_RELOAD: '@@redux-most/EPIC_END',
  LOCATION_CHANGE: '@@router/LOCATION_CHANGE',
};

export default actionTypes;
