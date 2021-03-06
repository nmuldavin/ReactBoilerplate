const config = require('../config/config.js');
const server = require('../server/main');
const debug = require('debug')('app:bin:server');

const port = config.serverPort;

server.listen(port);
debug(`Server is now running at http://localhost:${port}.`);
