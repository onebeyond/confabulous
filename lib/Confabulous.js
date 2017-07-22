var debug = require('debug')('confabulous:Confabulous')
var EventEmitter = require('events').EventEmitter
var async = require('async')
var merge = require('./merge')
var util = require('util')
var freeze = require('deep-freeze')

module.exports = Confabulous

function Confabulous(options) {

    var mergeFn = options && options.merge || merge
    var factories = []
    var self = this

    self.add = function add(factory) {
        factories.push(factory)
        return self
    }

    self.end = function end(cb) {
        if (!cb) return self.end(onLoaded)
        debug('loading')
        setImmediate(function() {
            load(function(err, config) {
                if (err) return cb(err)
                cb(null, freeze(config))
            })
        })
        return self
    }

    function onLoaded(err, config) {
        if (err) return self.emit('error', err)
        self.emit('loaded', config)
    }

    function reload() {
        debug('reloading')
        self.emit('reloading')
        load(function(err, config) {
            if (err) return self.emit('reload_error', err)
            self.emit('reloaded', freeze(config))
        })
    }

    function load(cb) {
        async.reduce(factories, {}, function(config, factory, cb) {
            var task = factory(config)
            task(self, function(err, result) {
                if (err === true) return cb(null, config)
                cb(err, mergeFn({}, config, result))
            }).on('change', reload).on('error', function(err) {
                self.emit('error', err)
            })
        }, cb)
    }

    EventEmitter.call(this);
}

util.inherits(Confabulous, EventEmitter);
