'use strict';

const port = 8010;

const logger = require('./src/utils/logger');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const app = require('./src/app')(db);

const buildSchemas = require('./src/utils/databaseWrapper').buildSchemas;

db.serialize(() => {
  buildSchemas(db);
  app.listen(port, () =>
    logger.info(`App started and listening on port ${port}`));
});
