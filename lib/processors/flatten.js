const debug = require('debug')('confabulous:transformers:flatten');
const flatten = require('flat');

module.exports = function () {
  return function (config, cb) {
    debug('running');
    cb(null, flatten(config));
  };
};
