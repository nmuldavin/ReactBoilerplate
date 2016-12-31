/**
 * @module utils/most
 * Utilities for most.js streams
 */
import { Stream } from 'most';

/**
 * Stream.prototype.ofType
 * Sugar for filtering out selected action types
 * @param  {String} selection - selected type
 * @return {Stream}           [description]
 */
Stream.prototype.ofType = function ofType(selection) {
  return this.filter(({ type }) => type === selection);
};
