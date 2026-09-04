/**
 * Production entry point forwarder for Render / cloud environments.
 * Ensures server starts successfully whether Render executes:
 * - npm start
 * - node index.js
 * - node server.js
 * - node dist/server.js
 * - node .
 */
require('./dist/server.js')
