var async = require('async')
var _ = require('lodash')
var util = require('util')
var EventEmitter = require('events').EventEmitter

module.exports = Confuse

function Confuse() {

    var config = {}
    var sources = []
    var self = this

    self.add = function add(fn) {
        sources.push(wrap(fn(config)))
        return this
    }

    self.end = function end(cb) {
        setImmediate(function() {
            async.seq.apply(async, sources)(config, function(err, result) {
                cb(err, result)
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

util.inherits(Confuse, EventEmitter);
