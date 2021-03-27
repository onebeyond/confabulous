var debug = require('debug')('confabulous:transformers:decrypt')
var crypto = require('crypto')
var async = require('async')
var merge = require('../merge')
var { has } = require('dot-prop');

module.exports = function(_options) {

    var options = merge({ contentEncoding: 'utf8', inputEncoding: 'hex' }, _options)

    return function(encrypted, cb) {
        debug('running')
        async.seq(validate, decrypt)(function(err, result) {
            if (err) return cb(err)
            return cb(null, result)
        })

        function validate(cb) {
            debug('validate: %s', JSON.stringify(options))
            if (!has(options, 'algorithm')) return cb(new Error('algorithm is required'))
            if (!has(options, 'password')) return cb(new Error('password is required'))
            cb()
        }

        function decrypt(cb) {
            var decipher = crypto.createDecipher(options.algorithm, options.password)
            var decrypted = ''
            decipher.on('readable', function() {
              var data = decipher.read()
              if (data) decrypted += data.toString(options.contentEncoding)
            }).on('end', function() {
              cb(null, decrypted)
            })
            decipher.write(encrypted, options.inputEncoding)
            decipher.end()
        }
    }

}
