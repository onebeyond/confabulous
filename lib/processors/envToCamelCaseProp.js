const debug = require('debug')('confabulous:transformers:envToCamelCaseProp');
const unflatten = require('flat').unflatten;
const merge = require('../merge');
const camelCase = require('camelize');

module.exports = function(_options) {

  const options = merge({ prefix: '', filter: /.*/ }, _options);

  return function(config, cb) {
    debug('running');

    const result = Object.keys(config).reduce((accumulator, key) => {
      if (!options.filter.test(key)) return accumulator;
      accumulator[toPropertyPath(stripPrefix(key, options.prefix))] = config[key];
      return accumulator;
    }, {});
    cb(null, camelCase(unflatten(result), { deep: true }));

    function stripPrefix(key, prefix) {
      return key.replace(new RegExp('^' + prefix), '');
    }

    function toPropertyPath(key) {
      return key.toLowerCase().replace(/__/g, '.');
    }
  };
};
