import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import store from './store/createStore';
import other from './other';

/**
 * MOUNT_NODE
 * @type {HtmlElement}
 * Html element on which to mount app
 */
const MOUNT_NODE = document.getElementById('root');

/**
 * Root
 * @type {ReactComponent}
 * Root application component
 */
const Root = () => (
  <Provider store={store}>
    <div>{other}</div>
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

// let render = (thing) => {
//   ReactDOM.render(
//     <AppContainer>
//       <div>{thing}</div>
//     </AppContainer>,
//     MOUNT_NODE
//   );
// };
//
// // ========================================================
// // Developer Tools Setup
// // ========================================================
//
// if (ENV_DEV) {
//   if (window.__REDUX_DEVTOOLS_EXTENSION__) {
//     window.__REDUX_DEVTOOLS_EXTENSION__.open();
//   }
// }
//
// // This code is excluded from production bundle
// if (ENV_DEV) {
//   if (module.hot) {
//     // Development render functions
//     const renderApp = render;
//     const renderError = (error) => {
//       const RedBox = require('redbox-react').default;
//
//       ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
//     };
//
//     // Wrap render in try/catch
//     render = (thing) => {
//       try {
//         renderApp(thing);
//       } catch (error) {
//         renderError(error);
//       }
//     };
//     if (module.hot) {
//       module.hot.accept('./other', () => {
//         const nextOther = require('./other').default;
//         render(nextOther);
//       });
//     }
//   }
// }
//
// // ========================================================
// // Go!
// // ========================================================
// render(other);
