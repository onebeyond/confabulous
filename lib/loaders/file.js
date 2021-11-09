const debug = require('debug')('confabulous:loaders:file');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const path = require('path');
const async = require('async');
const merge = require('../merge');

module.exports = function (_options, postProcessors) {
  const options = merge({ mandatory: true, encoding: 'utf8' }, _options);
  const emitter = new EventEmitter();

  return function (confabulous, cb) {
    debug('running');
    setImmediate(() => {
      async.waterfall([validate, resolve, exists, watch, load], (err, result) => {
        if (err) return cb(err);
        async.seq.apply(async, postProcessors)(result, cb);
      });
    });
    return emitter;

    function validate(cb) {
      debug('validate: %s', JSON.stringify(options));
      if (options.mandatory && !options.path) return cb(new Error('path is required'));
      if (options.path) return cb();
      cb(true);
    }

    function resolve(cb) {
      debug('resolve: %s', options.path);
      cb(null, path.resolve(options.path));
    }

    function exists(target, cb) {
      debug('exists: %s', target);
      fs.stat(target, (err) => {
        if (err && err.code === 'ENOENT' && !options.mandatory) return cb(true);
        cb(err, target);
      });
    }

    function watch(target, cb) {
      debug('watch: %s', target);
      if (!options.watch) return cb(null, target);
      const watcher = fs.watch(target, { persistent: false, encoding: options.encoding }, () => {
        emitter.emit('change');
      });
      confabulous.once('reloading', () => {
        watcher.close();
      });
      cb(null, target);
    }

    function load(target, cb) {
      debug('load: %s', target);
      fs.readFile(target, options.encoding, cb);
    }
  };
};
