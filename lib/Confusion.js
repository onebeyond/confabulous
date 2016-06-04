var async = require('async')
var _ = require('lodash')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var freeze = require('deep-freeze')

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
        return function(config, cb) {
            fn(config, function(err, result) {
                if (err) return cb(err)
                cb(null, _.merge({}, config, result))
            })
        }
    }

    EventEmitter.call(this);
}

util.inherits(Confusion, EventEmitter);
