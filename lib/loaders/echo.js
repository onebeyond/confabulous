const debug = require('debug')('confabulous:loaders:echo');
const EventEmitter = require('events').EventEmitter;
const async = require('async');

module.exports = function(data, postProcessors) {

  const emitter = new EventEmitter();

  return function(confabulous, cb) {
    debug('running');
    setImmediate(() => {
      async.seq.apply(async, postProcessors)(data, cb);
    });
    return emitter;
  };
};
