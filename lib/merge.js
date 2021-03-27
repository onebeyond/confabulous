const merge = require('merge');

module.exports = function() {
  const args = [].slice.call(arguments);
  return merge.recursive.apply(null, [true].concat(args));
};
