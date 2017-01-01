import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Match } from 'react-router';
import './utils/utils';
import store from './store/createStore';
import { Ping, Home } from './routes/routes';
import Header from './components';


/**
 * Html element on which to mount app
 */
const MOUNT_NODE = document.getElementById('root');

/**
 * Root
 * Root application component - wraps app in react-redux Provider component and Routing
 * NOTE: Using react-router v4 which is in alpha. The API could change.
 * @todo Connect router with redux store after router 4 api is finalized
 */
const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header />
        <Match exactly pattern="/" component={Home} />
        <Match exactly pattern="/ping" component={Ping} />
      </div>
    </BrowserRouter>
  </Provider>
);

/**
 * If not in hot reload mode, render root component at mount node
 */
if (!module.hot) {
  render(<Root />, MOUNT_NODE);
}

export {
  MOUNT_NODE,
  Root,
};
