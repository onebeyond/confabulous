var async = require('async')
var _ = require('lodash')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var freeze = require('deep-freeze')
var debug = require('debug')('confusion:main')

module.exports = Confusion

function Confusion() {

    var config = {}
    var sources = []
    var self = this

    self.add = function add(fn) {
        sources.push(wrap(fn(config)))
        return this
    }

    self.end = function end() {
        setImmediate(function() {
            async.seq.apply(async, sources)(config, function(err, result) {
                if (err) return self.emit('error', err)
                self.emit('loaded', freeze(result))
            })
        })
    }

    function wrap(fn) {
        var index = sources.length
        var first = true
        return function(config, cb) {
            fn(config, first ? reload(index, config) : undefined, function(err, result) {
                if (err) return cb(err)
                first = false
                cb(null, _.merge({}, config, result))
            })
        }
    }

    function reload(index, config) {
        return function() {
            setImmediate(function() {
                debug('Reloading from %d', index)
                async.seq.apply(async, sources.slice(index))(config, function(err, result) {
                    if (err) return self.emit('reload_error', err)
                    self.emit('reloaded', freeze(result))
                })
            })
        }
    }

    EventEmitter.call(this);
}

util.inherits(Confusion, EventEmitter);
