const debug = require('debug')('confabulous:transformers:decrypt');
const crypto = require('crypto');
const async = require('async');
const merge = require('../merge');
const { has } = require('dot-prop');

module.exports = function(_options) {

  const options = merge({ contentEncoding: 'utf8', inputEncoding: 'hex' }, _options);

  return function(encrypted, cb) {
    debug('running');
    async.seq(validate, decrypt)((err, result) => {
      if (err) return cb(err);
      return cb(null, result);
    });

    function validate(cb) {
      debug('validate: %s', JSON.stringify(options));
      if (!has(options, 'algorithm')) return cb(new Error('algorithm is required'));
      if (!has(options, 'password')) return cb(new Error('password is required'));
      cb();
    }

    function decrypt(cb) {
      const decipher = crypto.createDecipher(options.algorithm, options.password);
      let decrypted = '';
      decipher.on('readable', () => {
        const data = decipher.read();
        if (data) decrypted += data.toString(options.contentEncoding);
      }).on('end', () => {
        cb(null, decrypted);
      });
      decipher.write(encrypted, options.inputEncoding);
      decipher.end();
    }
  };

};
