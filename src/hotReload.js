import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as Hot } from 'react-hot-loader';
import { Root, MOUNT_NODE } from './main';

/**
 * function - render
 * Renders app inside hot reloader container at mount-node
 */
const render = () => {
  ReactDOM.render(
    <Hot>
      <Root />
    </Hot>,
    MOUNT_NODE);
};

/**
 * Launch redux dev tools
 */
/* eslint-disable no-underscore-dangle */
if (ENV_DEV && window.__REDUX_DEVTOOLS_EXTENSION__) {
  window.__REDUX_DEVTOOLS_EXTENSION__.open();
}
/* eslint-enable */

/**
 * Do the thing!
 */
render();

/**
 * register hot listener with render as callback
 */
module.hot.accept('./main', render);
