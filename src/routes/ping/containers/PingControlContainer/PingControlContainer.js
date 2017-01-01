/**
 * @module routes/ping/containers/PingControlContainer
 * Connects PingControl component to redux store and dispatch
 */
import { connect } from 'react-redux';
import actionTypes from '../../../../store/actionTypes';
import PingControl from '../../components/PingControl/PingControl';

/**
 * mapStateToProps - function mapping store to props passed to PingControl
 * @param  {*} state - redux store state
 * @return {object} object containing selected props
 */
const mapStateToProps = state => ({
  isPinging: state.ping.isPinging,
});

/**
 * mapDispatchToProps - object containing functions to be passed to PingControl
 * as callbacks. React-Redux sends the result of these functions through store.dispatch
 * @type {Object}
 */
const mapDispatchToProps = {
  ping: () => ({ type: actionTypes.PING }),
};

/**
 * PingControlContainer component created with react-redux connect method
 * @type {ReactComponent}
 */
const PingControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PingControl);

export default PingControlContainer;
