const debug = require('debug')('confabulous:loaders:env');
const EventEmitter = require('events').EventEmitter;
const async = require('async');

module.exports = function(postProcessors) {

  const emitter = new EventEmitter();

  return function(confabulous, cb) {
    debug('running');
    setImmediate(() => {
      async.seq.apply(async, postProcessors)(process.env, cb);
    });
    return emitter;
  };

};
