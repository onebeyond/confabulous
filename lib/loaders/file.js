var debug = require('debug')('confusion:loaders:file')
var EventEmitter = require('events').EventEmitter
var fs = require('fs')
var path = require('path')
var async = require('async')
var merge = require('lodash.merge')

module.exports = function(_options, postProcessors) {

    var options = merge({}, { mandatory: true, encoding: 'utf8' }, _options)
    var emitter = new EventEmitter()

    return function(config, cb) {
        debug('running')
        setImmediate(function() {
            async.waterfall([validate, resolve, exists, watch, load], function(err, result) {
                if (err) return cb(err)
                async.seq.apply(async, postProcessors)(result, cb)
            })
        })
        return emitter

        function validate(cb) {
            debug('validate: %s', JSON.stringify(options))
            if (options.mandatory && !options.path) return cb(null, new Error('path is required'))
            cb(!options.path)
        }

        function resolve(cb) {
            debug('resolve: %s', options.path)
            cb(null, path.resolve(options.path))
        }

        function exists(target, cb) {
            debug('exists: %s', target)
            fs.stat(target, function(err) {
                if (err && err.code == 'ENOENT' && !options.mandatory) return cb(true)
                cb(err, target)
            })
        }

        function watch(target, cb) {
            debug('watch: %s', target)
            if (options.watch) {
                var watcher = fs.watch(target, { persistent: false, encoding: options.encoding }, function() {
                    watcher.close()
                    emitter.emit('change')
                })
            }
            return cb(null, target)
        }

        function load(target, cb) {
            debug('load: %s', target)
            fs.readFile(target, options.encoding, cb)
        }
    }

}