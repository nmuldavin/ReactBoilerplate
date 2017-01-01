/**
 * @module routes/ping/components/PingControl
 * PingControl component for displaying ping state and pinging
 */
import React from 'react';

/**
 * PingControl - component for displaying ping state and pinging
 * @param {Boolean} isPinging - boolean describing ping state
 * @param {Function} ping - function to call when ping button clicked
 */
const PingControl = ({ isPinging, ping }) => (
  <div>
    <h1>I am pinging: {isPinging ? 'Yes' : 'No'}</h1>
    <button onClick={ping}>Ping Me</button>
  </div>
);

/**
 * React propTypes
 */
PingControl.propTypes = {
  isPinging: React.PropTypes.bool.isRequired,
  ping: React.PropTypes.func.isRequired,
};

export default PingControl;
