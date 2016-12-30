import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import other from './other';

const MOUNT_NODE = document.getElementById('root');

let render = (thing) => {
  ReactDOM.render(
    <AppContainer>
      <div>{thing}</div>
    </AppContainer>,
    MOUNT_NODE
  );
};

// ========================================================
// Developer Tools Setup
// ========================================================
/* eslint no-underscore-dangle: 0 global-require: 0*/
if (ENV_DEV) {
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    window.__REDUX_DEVTOOLS_EXTENSION__.open();
  }
}

// This code is excluded from production bundle
if (ENV_DEV) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = (thing) => {
      try {
        renderApp(thing);
      } catch (error) {
        renderError(error);
      }
    };
    if (module.hot) {
      module.hot.accept('./other', () => {
        const nextOther = require('./other').default;
        render(nextOther);
      });
    }
  }
}

// ========================================================
// Go!
// ========================================================
render(other);
