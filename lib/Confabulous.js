const debug = require('debug')('confabulous:Confabulous');
const EventEmitter = require('events').EventEmitter;
const async = require('async');
const merge = require('./merge');
const util = require('util');
const freeze = require('deep-freeze');

module.exports = Confabulous;

function Confabulous(options) {
  const mergeFn = (options && options.merge) || merge;
  const factories = [];
  const self = this;

  self.add = function add(factory) {
    factories.push(factory);
    return self;
  };

  self.end = function end(cb) {
    if (!cb) return self.end(onLoaded);
    debug('loading');
    setImmediate(() => {
      load((err, config) => {
        if (err) return cb(err);
        cb(null, freeze(config));
      });
    });
    return self;
  };

  function onLoaded(err, config) {
    if (err) return self.emit('error', err);
    self.emit('loaded', config);
  }

  function reload() {
    debug('reloading');
    self.emit('reloading');
    load((err, config) => {
      if (err) return self.emit('reload_error', err);
      self.emit('reloaded', freeze(config));
    });
  }

  function load(cb) {
    async.reduce(
      factories,
      {},
      (config, factory, cb) => {
        const task = factory(config);
        task(self, (err, result) => {
          if (err === true) return cb(null, config);
          cb(err, mergeFn({}, config, result));
        })
          .on('change', reload)
          .on('error', (err) => {
            self.emit('error', err);
          });
      },
      cb
    );
  }

  EventEmitter.call(this);
}

util.inherits(Confabulous, EventEmitter);
