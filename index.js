'use strict';

const port = 8010;

const logger = require('./src/logger');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const app = require('./src/app')(db);

const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);
  app.listen(port, () =>
    logger.info(`App started and listening on port ${port}`));
});
