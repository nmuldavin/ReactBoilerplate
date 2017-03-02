import React, { Component, PropTypes } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Ping, Home } from './routes/routes';
import Header from './components';
import store from './store/createStore';
import actionTypes from './store/actionTypes';

/**
 * Special action creator to location in store
 * @param {Object} location new location object
 */
const setLocation = location => store.dispatch({ type: actionTypes.LOCATION_CHANGE, location });

/**
 * Routes component. Takes location object as prop,
 * then syncs it with store before rendering. Should contain all top level
 * Application routes
 */
class Routes extends Component {
  /**
   * Sync location initially before mount.
   */
  componentWillMount() {
    setLocation(this.props.location);
  }

  /**
   * Don't sync store or re-render if location didn't change
   */
  shouldComponentUpdate(nextProps) {
    return this.props.location.pathname !== nextProps.location.pathname;
  }

  /**
   * Sync store before re-render on location change
   */
  componentWillUpdate(nextProps) {
    setLocation(nextProps.location);
  }

  render() {
    return (
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route exact path="/ping" component={Ping} />
      </div>
    );
  }
}

Routes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

/**
 * Using withRouter wraps Router component and passes it location as prop
 */
const ConnectedRoutes = withRouter(Routes);

export default ConnectedRoutes;
