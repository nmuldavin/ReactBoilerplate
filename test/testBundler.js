import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(sinonChai);
chai.use(chaiEnzyme());

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []; // eslint-disable-line
const inManifest = path => ~__karmaWebpackManifest__.indexOf(path); //eslint-disable-line

// require all `.spec.js` anywhere in the project
const testsContext = require.context('..', true, /\.spec\.js$/);

// only run tests that have changed after the first pass.
const testsToRun = testsContext.keys().filter(inManifest);
(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext);

// require all `src/**/*.js` except for `main.js, any index.js or hotReload.js
if (REPORT_COVERAGE) {
  const componentsContext = require.context('../src/', true, /^((?!main|index|hotReload).)*\.js$/);
  componentsContext.keys().forEach(componentsContext);
}
