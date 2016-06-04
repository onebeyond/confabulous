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
        setImmediate(function() {
            debug('Loading')
            var index = 0
            var config = {}
            async.eachSeries(factories, function(factory, cb) {
                var task = factory(config)
                var onChange = reload(factories.slice(index++), config)
                task(config, function(err, result) {
                    if (err === true) return cb()
                    config = merge({}, config, result)
                    cb(err)
                }).on('change', onChange).on('error', function(err) {
                    self.emit(err)
                })
            }, function(err) {
                if (err) return self.emit('error', err)
                self.emit('loaded', freeze(config))
            })
        })
    }

    function reload(factories, config) {
        return function() {
            debug('Reloading')
            var index = 0
            async.eachSeries(factories, function(factory, cb) {
                var task = factory(config)
                var onChange = reload(factories.slice(index++), config)
                task(config, function(err, result) {
                    if (err === true) return cb()
                    config = merge({}, config, result)
                    cb(err)
                }).on('change', onChange).on('error', function(err) {
                    self.emit(err)
                })
            }, function(err) {
                if (err) return self.emit('reload_error', err)
                self.emit('reloaded', freeze(config))
            })
        }
    }

    EventEmitter.call(this);
}

util.inherits(Confusion, EventEmitter);
