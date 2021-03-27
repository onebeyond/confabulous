const debug = require('debug')('confabulous:transformers:unflatten');
const unflatten = require('flat').unflatten;

module.exports = function() {

  return function(config, cb) {
    debug('running');
    cb(null, unflatten(config));
  };
};