const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const port = config.port;

const server = app.listen(port, () => {
  logger.info(`Backend listening on port ${port}`);
});

module.exports = server;
