const debug = require('debug')('confabulous:loaders:env');
const EventEmitter = require('events').EventEmitter;
const async = require('async');
const minimist = require('minimist');

module.exports = function(postProcessors) {

  const emitter = new EventEmitter();

  return function(confabulous, cb) {
    debug('running');
    setImmediate(() => {
      const args = minimist(process.argv.slice(2));
      async.seq.apply(async, postProcessors)(args, cb);
    });
    return emitter;
  };
};