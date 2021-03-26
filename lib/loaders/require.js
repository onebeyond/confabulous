var debug = require('debug')('confabulous:loaders:require')
var EventEmitter = require('events').EventEmitter
var fs = require('fs')
var path = require('path')
var async = require('async')
var merge = require('../merge')

module.exports = function req(_options, postProcessors) {

    var options = merge({ mandatory: true, encoding: 'utf8' }, _options)
    var emitter = new EventEmitter()

    return function(confabulous, cb) {
        debug('running')
        setImmediate(function() {
            async.waterfall([validate, resolve, exists, watch, clear, load], function(err, result) {
                if (err) return cb(err)
                async.seq.apply(async, postProcessors)(result, cb)
            })
        })
        return emitter

        function validate(cb) {
            debug('validate: %s', JSON.stringify(options))
            if (options.mandatory && !options.path) return cb(new Error('path is required'))
            if (options.path) return cb()
            cb(true)
        }

        function resolve(cb) {
            debug('resolve: %s', options.path)
            cb(null, path.resolve(options.path))
        }

        function exists(target, cb) {
            debug('exists: %s', target)
            fs.stat(target, function(err) {
                if (err && err.code === 'ENOENT' && !options.mandatory) return cb(true)
                cb(err, target)
            })
        }

        function watch(target, cb) {
            debug('watch: %s', target)
            if (!options.watch) return cb(null, target)
            var watcher = fs.watch(target, { persistent: false, encoding: options.encoding }, function() {
                emitter.emit('change')
            })
            confabulous.once('reloading', function() {
                watcher.close()
            })
            cb(null, target)
        }

        function clear(target, cb) {
            debug('clear cache: %s', target)
            delete require.cache[target]
            return cb(null, target)
        }

        function load(target, cb) {
            debug('load: %s', target)
            var required
            try {
                required = require(target)
            } catch (err) {
                return cb(err)
            }
            cb(null, required)
        }
    }

}
