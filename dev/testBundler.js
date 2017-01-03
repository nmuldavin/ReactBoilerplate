import 'babel-polyfill';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();
// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
// const __karmaWebpackManifest__ = []; // eslint-disable-line
// const inManifest = (path) => ~__karmaWebpackManifest__.indexOf(path); //eslint-disable-line

// require all `.spec.js` anywhere in the project
const testsContext = require.context('../src/', true, /\.spec\.js$/);

testsContext.keys().forEach(testsContext);


// // only run tests that have changed after the first pass.
// const testsToRun = testsContext.keys().filter(inManifest)
// ;(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext) //eslint-disable-line

// require all `src/**/*.js` except for `main.js, any index.js or hotReload.js
if (REPORT_COVERAGE) {
  const componentsContext = require.context('../src/', true, /^((?!main|hotReload|index|createStore|\.spec).)*\.js$/);
  componentsContext.keys().forEach(componentsContext);
}
