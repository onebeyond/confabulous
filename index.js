const path = require('path');

const Confabulous = require('./lib/Confabulous');

Confabulous.Confabulous = Confabulous; // Remain backwards compatible with old API (yuck!!!!)

Confabulous.loaders = {
  args: require('./lib/loaders/args'),
  echo: require('./lib/loaders/echo'),
  env: require('./lib/loaders/env'),
  file: require('./lib/loaders/file'),
  require: require('./lib/loaders/require'),
};

Confabulous.processors = {
  decrypt: require('./lib/processors/decrypt'),
  envToCamelCaseProp: require('./lib/processors/envToCamelCaseProp'),
  envToProp: require('./lib/processors/envToProp'),
  flatten: require('./lib/processors/flatten'),
  json: require('./lib/processors/json'),
  mount: require('./lib/processors/mount'),
  unflatten: require('./lib/processors/unflatten'),
};

module.exports = Confabulous;
