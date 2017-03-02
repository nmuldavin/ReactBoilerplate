import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './utils/utils';
import store from './store/createStore';
import ConnectedRoutes from './Routes';


/**
 * Html element on which to mount app
 */
const MOUNT_NODE = document.getElementById('root');

/**
 * Root
 * Root application component - wraps app in react-redux Provider component and
 * Browser Router. Renders routes specified in ConnectedRoutes component
 */
const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ConnectedRoutes />
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
