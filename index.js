'use strict';

const port = 8010;

const logger = require('./src/utils/logger');
const cluster = require('cluster');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/utils/databaseWrapper').buildSchemas;

if (cluster.isMaster) {
  // Count the machine's CPUs
  const cpuCount = require('os').cpus().length;
  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', function () {
    // Replace the dying worker
    cluster.fork();
  });

} else {
  const app = require('./src/app')(db);
  db.serialize(() => {
    buildSchemas(db);
    app.listen(port, () =>
      logger.info(`App started and listening on port ${port}`));
  });
}

