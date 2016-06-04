var fs = require('fs')
var path = require('path')
var async = require('async')
var debug = require('debug')('confusion:loaders:req')

module.exports = function(options) {
    return function(config, cb) {

        async.waterfall([
            validate,
            resolve,
            exists,
            load,
        ], function(err, result) {
            if (err === true) return cb()
            if (err) return cb(err)
            return cb(null, result)
        })
    }

    function validate(cb) {
        debug('validate: %s', JSON.stringify(options))
        if (!options.path) return cb(null, new Error('path is required'))
        cb()
    }

    function resolve(cb) {
        debug('resolve: %s', options.path)
        cb(null, path.resolve(options.path))
    }

    function exists(target, cb) {
        debug('exists: %s', target)
        if (!fs.existsSync(target)) return cb(true)
        cb(null, target)
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