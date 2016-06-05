var debug = require('debug')('confusion:Confusion')
var EventEmitter = require('events').EventEmitter
var async = require('async')
var merge = require('lodash.merge')
var util = require('util')
var freeze = require('deep-freeze')

module.exports = Confusion

function Confusion() {

    var factories = []
    var self = this

    self.add = function add(factory) {
        factories.push(factory)
        return this
    }

    self.end = function end() {
        debug('loading')
        self.emit('loading')
        setImmediate(function() {
            load(function(err, config) {
                if (err) return self.emit('error', err)
                self.emit('loaded', freeze(config))
            })
        })
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
                cb(err, merge({}, config, result))
            }).on('change', reload).on('error', function(err) {
                self.emit(err)
            })
        }, cb)
    }

    EventEmitter.call(this);
}

util.inherits(Confusion, EventEmitter);
